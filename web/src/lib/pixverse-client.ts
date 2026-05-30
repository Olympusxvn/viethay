export interface PixverseParams {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  duration?: number;
  quality?: string;
  model?: string;
}

/** PixVerse status codes from the result endpoint */
export const PIXVERSE_STATUS = {
  SUCCESS: 1,
  GENERATING: 5,
  DELETED: 6,
  MODERATION_FAILED: 7,
  FAILED: 8,
} as const;

function keyHeader(apiKey?: string): Record<string, string> {
  return apiKey ? { "x-pixverse-key": apiKey } : {};
}

export async function hasServerKey(): Promise<boolean> {
  try {
    const res = await fetch("/api/pixverse/config");
    const data = await res.json();
    return Boolean(data.hasServerKey);
  } catch {
    return false;
  }
}

export async function testPixverseKey(
  apiKey: string | undefined
): Promise<{ valid: boolean; credits?: number; error?: string }> {
  try {
    const res = await fetch("/api/pixverse/test", {
      headers: { ...keyHeader(apiKey) },
    });
    return (await res.json()) as {
      valid: boolean;
      credits?: number;
      error?: string;
    };
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : "Request failed" };
  }
}

export async function startPixverseGeneration(
  apiKey: string | undefined,
  params: PixverseParams
): Promise<number> {
  const res = await fetch("/api/pixverse/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...keyHeader(apiKey),
    },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "PixVerse generation failed");
  }
  return data.videoId as number;
}

export async function getPixverseResult(
  apiKey: string | undefined,
  videoId: number
): Promise<{ status: number; url: string }> {
  const res = await fetch(`/api/pixverse/result?id=${videoId}`, {
    headers: { ...keyHeader(apiKey) },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "PixVerse status failed");
  }
  return { status: data.status as number, url: (data.url as string) ?? "" };
}
