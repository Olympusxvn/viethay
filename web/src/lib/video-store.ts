import type { GenerateInput, GeneratedScript, VideoProject } from "./types";

const STORAGE_KEY = "viethay_videos";

function readAll(): VideoProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VideoProject[]) : [];
  } catch {
    return [];
  }
}

function writeAll(videos: VideoProject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  window.dispatchEvent(new Event("viethay-videos-updated"));
}

export function listVideos(): VideoProject[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getVideo(id: string): VideoProject | undefined {
  return readAll().find((v) => v.id === id);
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
  const all = readAll();
  all.unshift(project);
  writeAll(all);
  return project;
}

export function updateVideo(
  id: string,
  patch: Partial<VideoProject>
): VideoProject | undefined {
  const all = readAll();
  const idx = all.findIndex((v) => v.id === id);
  if (idx < 0) return undefined;
  all[idx] = { ...all[idx], ...patch };
  writeAll(all);
  return all[idx];
}

export function deleteVideo(id: string): void {
  writeAll(readAll().filter((v) => v.id !== id));
}

/** Demo video URL — replace with PixVerse output when API key is configured */
export const DEMO_VIDEO_URL =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export async function simulateVideoGeneration(
  projectId: string,
  hasApiKey: boolean
): Promise<void> {
  const delay = hasApiKey ? 4000 : 2500;
  await new Promise((r) => setTimeout(r, delay));
  updateVideo(projectId, {
    status: "ready",
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: undefined,
  });
}
