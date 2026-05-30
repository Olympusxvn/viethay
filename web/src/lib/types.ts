export type VideoStyle = "tiktok" | "shopee" | "lazada" | "premium" | "funny";

export type VideoGoal = "shopee" | "tiktok" | "lazada";

export interface GenerateInput {
  productName: string;
  description: string;
  style: VideoStyle;
  goal: VideoGoal;
  imageDataUrls: string[];
}

export interface StoryboardShot {
  id: string;
  title: string;
  durationSec: number;
  prompt: string;
  camera: string;
}

export interface GeneratedScript {
  hook: string;
  shots: StoryboardShot[];
  finalPrompt: string;
  negativePrompt: string;
  subtitles: { start: number; end: number; text: string }[];
}

export interface ReelShot {
  title: string;
  prompt: string;
  videoUrl: string;
  coverUrl?: string;
  duration: number;
  model?: string;
}

export interface VideoProject {
  id: string;
  createdAt: string;
  input: GenerateInput;
  script: GeneratedScript;
  status: "generating" | "ready" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
  mockViews?: number;
  mockCtr?: number;
  /** PixVerse video_id when generated via the real API */
  pixverseId?: number;
  /** Whether this was produced by the real PixVerse API (vs demo sample) */
  real?: boolean;
  /** Multi-shot reel assembled from real PixVerse clips (>= 30s total) */
  reel?: ReelShot[];
  error?: string;
}

export interface AppSettings {
  pixverseApiKey: string;
  vnTone: boolean;
}
