import type { GenerateInput, GeneratedScript, StoryboardShot } from "./types";

export function generateScript(input: GenerateInput): GeneratedScript {
  const product = input.productName.trim() || "Sản phẩm";
  const desc = input.description.trim() || "Chất lượng cao, giá tốt";

  const styleLabel =
    input.style === "funny"
      ? "hài hước, gần gũi"
      : input.style === "premium"
        ? "cao cấp, tinh tế"
        : "năng lượng, FOMO";

  const shots: StoryboardShot[] = [
    {
      id: "1",
      title: "Hook — Thu hút ngay",
      durationSec: 5,
      prompt: `Close-up ${product}, vibrant Vietnamese e-commerce lighting, ${styleLabel} mood, quick zoom-in`,
      camera: "Fast push-in, 9:16 vertical",
    },
    {
      id: "2",
      title: "Lợi ích sản phẩm",
      durationSec: 8,
      prompt: `${product} in real usage scene: ${desc}, warm Saigon cafe or modern home, smooth dolly`,
      camera: "Medium shot, slow pan",
    },
    {
      id: "3",
      title: "Chi tiết & chất lượng",
      durationSec: 8,
      prompt: `Macro detail of ${product}, premium texture highlight, soft natural light, cinematic 1080p`,
      camera: "Macro + rack focus",
    },
    {
      id: "4",
      title: "CTA — Mua ngay",
      durationSec: 9,
      prompt: `Happy Vietnamese customer with ${product}, price tag overlay vibe, energetic ending, ${styleLabel}`,
      camera: "Wide to close-up, upbeat",
    },
  ];

  const finalPrompt = `A premium Vietnamese marketing video featuring ${product}. ${desc}. Dynamic cinematic shots with smooth dolly and push-in, warm natural lighting, ${styleLabel} tone, culturally relevant modern Vietnam setting, product clearly visible, realistic motion, 1080p highly detailed --ar 9:16`;

  return {
    hook: `🔥 ${product} — chỉ 60 giây để biến mô tả thành video bán hàng cực cháy!`,
    shots,
    finalPrompt,
    negativePrompt:
      "blurry, deformed, low quality, shaky camera, text distortion, ugly, extra limbs, watermark",
    subtitles: [
      { start: 0, end: 5, text: `✨ ${product} — Mới về, số lượng có hạn!` },
      { start: 5, end: 13, text: desc.slice(0, 60) },
      { start: 13, end: 21, text: "Chất lượng cao • Giao nhanh 2h" },
      { start: 21, end: 30, text: "👉 Nhấn MUA NGAY — Freeship toàn quốc!" },
    ],
  };
}
