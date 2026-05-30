import { NextRequest, NextResponse } from "next/server";
import { localSuggestions, type DescribeInput } from "@/lib/description-ai";

export const runtime = "nodejs";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

async function llmSuggestions(input: DescribeInput): Promise<string[] | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const sys =
    "Bạn là chuyên gia copywriting marketing thương mại điện tử Việt Nam. " +
    "Viết mô tả sản phẩm ngắn gọn, hấp dẫn, đúng văn phong người Việt mua sắm online.";
  const user =
    `Sản phẩm: ${input.productName}\n` +
    `Phong cách video: ${input.style}\n` +
    `Nền tảng: ${input.goal}\n` +
    (input.seed ? `Gợi ý thêm: ${input.seed}\n` : "") +
    "Hãy viết đúng 3 mô tả sản phẩm khác nhau, mỗi mô tả 1-2 câu, có CTA. " +
    "Trả về dạng JSON array các chuỗi, không kèm giải thích.";

  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.9,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string = data.choices?.[0]?.message?.content ?? "";
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return null;
    const arr = JSON.parse(match[0]) as unknown;
    if (Array.isArray(arr)) {
      const cleaned = arr.filter((x): x is string => typeof x === "string").slice(0, 3);
      return cleaned.length ? cleaned : null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: DescribeInput;
  try {
    body = (await req.json()) as DescribeInput;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.productName?.trim()) {
    return NextResponse.json({ error: "Missing product name" }, { status: 400 });
  }

  const llm = await llmSuggestions(body);
  if (llm) {
    return NextResponse.json({ suggestions: llm, source: "llm" });
  }
  return NextResponse.json({
    suggestions: localSuggestions(body),
    source: "local",
  });
}
