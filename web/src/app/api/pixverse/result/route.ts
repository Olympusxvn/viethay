import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PIXVERSE_RESULT = "https://app-api.pixverse.ai/openapi/v2/video/result";

export async function GET(req: NextRequest) {
  const apiKey =
    req.headers.get("x-pixverse-key") || process.env.PIXVERSE_API_KEY;
  const id = req.nextUrl.searchParams.get("id");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing PixVerse API key" }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: "Missing video id" }, { status: 400 });
  }

  try {
    const res = await fetch(`${PIXVERSE_RESULT}/${id}`, {
      headers: {
        "API-KEY": apiKey,
        "Ai-trace-id": crypto.randomUUID(),
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (data.ErrCode !== 0) {
      return NextResponse.json(
        { error: data.ErrMsg || "PixVerse status failed", code: data.ErrCode },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: data.Resp?.status,
      url: data.Resp?.url ?? "",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "PixVerse request failed" },
      { status: 502 }
    );
  }
}
