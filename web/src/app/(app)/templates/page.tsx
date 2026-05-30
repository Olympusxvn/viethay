import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TEMPLATES = [
  {
    id: "beauty",
    name: "Beauty & Skincare",
    desc: "Close-up texture, soft light, FOMO flash sale",
    emoji: "💄",
  },
  {
    id: "food",
    name: "Food & Beverage",
    desc: "Steam, appetite appeal, Mekong / street food vibe",
    emoji: "🍜",
  },
  {
    id: "fashion",
    name: "Fashion",
    desc: "Outfit transitions, urban Saigon backdrop",
    emoji: "👗",
  },
  {
    id: "home",
    name: "Home & Living",
    desc: "Cozy interior, before/after, practical benefits",
    emoji: "🏠",
  },
];

export default function TemplatesPage() {
  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#f5f5f7]">Templates</h1>
        <p className="text-xs text-[#e9eaf2]/60">
          Mẫu theo ngành — chọn và tùy chỉnh trên Generate
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {TEMPLATES.map((t) => (
          <Card
            key={t.id}
            className="border-white/10 bg-white/[0.05] ring-white/10 transition-colors hover:border-[#ff8a3d]/30"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-2xl">{t.emoji}</span>
                {t.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-3">
              <p className="text-sm text-[#e9eaf2]/65">{t.desc}</p>
              <Button size="sm" variant="outline" render={<Link href="/generate" />}>
                Use
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
