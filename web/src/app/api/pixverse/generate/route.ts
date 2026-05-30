import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PIXVERSE_GENERATE =
  "https://app-api.pixverse.ai/openapi/v2/video/text/generate";

interface GenerateBody {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  duration?: number;
  quality?: string;
  model?: string;
}

export async function POST(req: NextRequest) {
  const apiKey =
    req.headers.get("x-pixverse-key") || process.env.PIXVERSE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing PixVerse API key" }, { status: 400 });
  }

  let body: GenerateBody;
  try {
    body = (await req.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  try {
    const res = await fetch(PIXVERSE_GENERATE, {
      method: "POST",
      headers: {
        "API-KEY": apiKey,
        "Ai-trace-id": crypto.randomUUID(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aspect_ratio: body.aspectRatio ?? "9:16",
        duration: body.duration ?? 8,
        model: body.model ?? "v4.5",
        motion_mode: "normal",
        negative_prompt: body.negativePrompt ?? "",
        prompt: body.prompt,
        quality: body.quality ?? "540p",
        water_mark: false,
      }),
    });

    const data = await res.json();
    if (data.ErrCode !== 0) {
      return NextResponse.json(
        { error: data.ErrMsg || "PixVerse generation failed", code: data.ErrCode },
        { status: 502 }
      );
    }

    return NextResponse.json({ videoId: data.Resp?.video_id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "PixVerse request failed" },
      { status: 502 }
    );
  }
}
