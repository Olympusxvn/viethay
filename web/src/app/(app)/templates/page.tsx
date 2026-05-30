"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import type { TranslationKey } from "@/lib/i18n";

const TEMPLATES: {
  id: string;
  nameKey: TranslationKey;
  descKey: TranslationKey;
  emoji: string;
}[] = [
  { id: "beauty", nameKey: "tpl.beauty", descKey: "tpl.beautyDesc", emoji: "💄" },
  { id: "food", nameKey: "tpl.food", descKey: "tpl.foodDesc", emoji: "🍜" },
  { id: "fashion", nameKey: "tpl.fashion", descKey: "tpl.fashionDesc", emoji: "👗" },
  { id: "home", nameKey: "tpl.home", descKey: "tpl.homeDesc", emoji: "🏠" },
];

export default function TemplatesPage() {
  const { t } = useTranslation();

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#f5f5f7]">{t("templates.title")}</h1>
        <p className="text-xs text-[#e9eaf2]/60">{t("templates.subtitle")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {TEMPLATES.map((tpl) => (
          <Card
            key={tpl.id}
            className="border-white/10 bg-white/[0.05] ring-white/10 transition-colors hover:border-[#ff8a3d]/30"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-2xl">{tpl.emoji}</span>
                {t(tpl.nameKey)}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-3">
              <p className="text-sm text-[#e9eaf2]/65">{t(tpl.descKey)}</p>
              <Button size="sm" variant="outline" render={<Link href="/generate" />}>
                {t("templates.use")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
