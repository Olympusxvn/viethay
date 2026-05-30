import type { DescribeInput } from "./description-ai";
import { localSuggestions } from "./description-ai";

export async function suggestDescriptions(
  input: DescribeInput
): Promise<{ suggestions: string[]; source: string }> {
  try {
    const res = await fetch("/api/ai/describe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("request failed");
    return (await res.json()) as { suggestions: string[]; source: string };
  } catch {
    return { suggestions: localSuggestions(input), source: "local" };
  }
}
