import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PIXVERSE_BALANCE =
  "https://app-api.pixverse.ai/openapi/v2/account/balance";

export async function GET(req: NextRequest) {
  const apiKey =
    req.headers.get("x-pixverse-key") || process.env.PIXVERSE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { valid: false, error: "Missing PixVerse API key" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(PIXVERSE_BALANCE, {
      method: "GET",
      headers: {
        "API-KEY": apiKey,
        "Ai-trace-id": crypto.randomUUID(),
      },
    });

    const data = await res.json();
    if (data.ErrCode !== 0) {
      return NextResponse.json(
        { valid: false, error: data.ErrMsg || "Invalid API key", code: data.ErrCode },
        { status: 200 }
      );
    }

    const credits =
      (data.Resp?.credit_monthly ?? 0) + (data.Resp?.credit_package ?? 0);
    return NextResponse.json({ valid: true, credits });
  } catch (err) {
    return NextResponse.json(
      { valid: false, error: err instanceof Error ? err.message : "Request failed" },
      { status: 200 }
    );
  }
}
