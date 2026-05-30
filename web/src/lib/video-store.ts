import type { GenerateInput, GeneratedScript, ReelShot, VideoProject } from "./types";
import { generateScript } from "./script-generator";

const STORAGE_KEY = "viethay_videos";
const EVENT = "viethay-videos-updated";

const EMPTY: VideoProject[] = [];

/**
 * useSyncExternalStore requires getSnapshot to return a referentially stable
 * value when nothing changed. We cache the sorted list and only recompute it
 * after a mutation (or a cross-tab storage event), otherwise React loops
 * forever and crashes with a client-side exception.
 */
let snapshot: VideoProject[] | null = null;

function readRaw(): VideoProject[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VideoProject[];
    return parsed.map(migrateVideoUrl);
  } catch {
    return [];
  }
}

/** Old demo URLs (private GCS bucket) now return AccessDenied — heal them. */
function migrateVideoUrl(v: VideoProject): VideoProject {
  if (v.videoUrl && v.videoUrl.includes("gtv-videos-bucket")) {
    return { ...v, videoUrl: pickDemoVideo(v.id) };
  }
  return v;
}

function rebuild(): VideoProject[] {
  snapshot = readRaw()
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  return snapshot;
}

function invalidate(): void {
  snapshot = null;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

function writeAll(videos: VideoProject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  invalidate();
}

export function listVideos(): VideoProject[] {
  if (typeof window === "undefined") return EMPTY;
  return snapshot ?? rebuild();
}

export function getServerVideos(): VideoProject[] {
  return EMPTY;
}

export function getVideo(id: string): VideoProject | undefined {
  return listVideos().find((v) => v.id === id);
}

export function subscribeVideos(onChange: () => void): () => void {
  const handler = () => {
    snapshot = null;
    onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", handler);
  };
}

export function createVideo(
  input: GenerateInput,
  script: GeneratedScript
): VideoProject {
  const project: VideoProject = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    script,
    status: "generating",
    mockViews: Math.floor(1200 + Math.random() * 8000),
    mockCtr: Math.round((2.4 + Math.random() * 4.2) * 10) / 10,
  };
  const all = readRaw().slice();
  all.unshift(project);
  writeAll(all);
  return project;
}

export function updateVideo(
  id: string,
  patch: Partial<VideoProject>
): VideoProject | undefined {
  const all = readRaw().slice();
  const idx = all.findIndex((v) => v.id === id);
  if (idx < 0) return undefined;
  all[idx] = { ...all[idx], ...patch };
  writeAll(all);
  return all[idx];
}

export function deleteVideo(id: string): void {
  writeAll(readRaw().filter((v) => v.id !== id));
}

/** Create a ready project backed by a real multi-shot PixVerse reel (>=30s). */
export function createReelProject(
  productName: string,
  shots: ReelShot[]
): VideoProject {
  const input: GenerateInput = {
    productName,
    description: shots[0]?.prompt ?? "",
    style: "premium",
    goal: "tiktok",
    imageDataUrls: [],
  };
  const project: VideoProject = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    script: generateScript(input),
    status: "ready",
    real: true,
    reel: shots,
    videoUrl: shots[0]?.videoUrl,
    thumbnailUrl: shots[0]?.coverUrl,
    mockViews: Math.floor(1200 + Math.random() * 8000),
    mockCtr: Math.round((2.4 + Math.random() * 4.2) * 10) / 10,
  };
  const all = readRaw().slice();
  all.unshift(project);
  writeAll(all);
  return project;
}

interface DemoReelFile {
  product: string;
  shots: ReelShot[];
}

/** Load the prebuilt PixVerse demo reel (generated via the CLI) into history. */
export async function importDemoReel(): Promise<VideoProject | null> {
  try {
    const res = await fetch("/demo-reel.json", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as DemoReelFile;
    if (!data.shots?.length) return null;
    return createReelProject(data.product || "PixVerse Demo", data.shots);
  } catch {
    return null;
  }
}

/**
 * Public demo videos used in demo mode (no PixVerse key). Replace with the
 * real PixVerse render output once an API key is configured.
 */
export const DEMO_VIDEO_POOL = [
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_2MB.mp4",
];

export function pickDemoVideo(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return DEMO_VIDEO_POOL[h % DEMO_VIDEO_POOL.length];
}

export async function simulateVideoGeneration(
  projectId: string,
  hasApiKey: boolean
): Promise<void> {
  const delay = hasApiKey ? 4000 : 2500;
  await new Promise((r) => setTimeout(r, delay));
  updateVideo(projectId, {
    status: "ready",
    videoUrl: pickDemoVideo(projectId),
    thumbnailUrl: undefined,
  });
}
