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
}

export interface AppSettings {
  pixverseApiKey: string;
  vnTone: boolean;
}
