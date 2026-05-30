import type { VideoGoal, VideoStyle } from "./types";

export interface DescribeInput {
  productName: string;
  seed?: string;
  style: VideoStyle;
  goal: VideoGoal;
}

const STYLE_TONE: Record<VideoStyle, { adj: string[]; vibe: string }> = {
  tiktok: { adj: ["hot trend", "viral", "cực cháy"], vibe: "bắt trend, năng lượng" },
  shopee: { adj: ["giá sốc", "deal hời", "freeship"], vibe: "săn sale, giá tốt" },
  lazada: { adj: ["chính hãng", "uy tín", "bảo hành"], vibe: "tin cậy, an tâm" },
  premium: { adj: ["cao cấp", "tinh tế", "sang trọng"], vibe: "đẳng cấp, tinh xảo" },
  funny: { adj: ["bá đạo", "lầy lội", "cười xỉu"], vibe: "hài hước, gần gũi" },
};

const GOAL_CTA: Record<VideoGoal, string> = {
  shopee: "Chốt đơn ngay trên Shopee, freeship toàn quốc!",
  tiktok: "Nhấn giỏ hàng TikTok Shop — số lượng có hạn!",
  lazada: "Đặt ngay trên Lazada, giao nhanh 2h!",
};

const BENEFITS = [
  "chất liệu bền đẹp",
  "thiết kế tinh tế",
  "dễ dùng cho mọi người",
  "giá hợp lý so với chất lượng",
  "được hàng nghìn khách tin dùng",
  "đóng gói chắc chắn, giao nhanh",
];

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length && out.length < n) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

/** Local fallback generator — produces 3 distinct Vietnamese marketing descriptions. */
export function localSuggestions(input: DescribeInput): string[] {
  const name = input.productName.trim() || "Sản phẩm";
  const tone = STYLE_TONE[input.style];
  const cta = GOAL_CTA[input.goal];

  return [
    `${name} ${tone.adj[0]} — ${pick(BENEFITS, 2).join(", ")}. ${cta}`,
    `Bạn đang tìm ${name}? Sản phẩm ${tone.vibe}, ${pick(BENEFITS, 2).join(", ")}. ${cta}`,
    `${name} mới về! ${pick(BENEFITS, 3).join(", ")} — phù hợp xu hướng ${tone.adj[1]}. ${cta}`,
  ];
}
