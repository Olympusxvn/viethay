"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Play, BarChart3, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useExternalStore } from "@/hooks/use-client-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  deleteVideo,
  getServerVideos,
  importDemoReel,
  listVideos,
  subscribeVideos,
} from "@/lib/video-store";

export default function HistoryPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const videos = useExternalStore(subscribeVideos, listVideos, getServerVideos);
  const [importing, setImporting] = useState(false);

  async function handleImportReel() {
    setImporting(true);
    const project = await importDemoReel();
    setImporting(false);
    if (project) router.push(`/results/${project.id}`);
  }

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#f5f5f7]">{t("history.title")}</h1>
          <p className="text-xs text-[#e9eaf2]/60">{t("history.subtitle")}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleImportReel}
          disabled={importing}
          className="border-violet-400/30 bg-violet-500/15 text-violet-100"
        >
          {importing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {t("history.loadReel")}
        </Button>
      </div>

      {videos.length === 0 ? (
        <Card className="border-white/10 bg-white/[0.04] ring-white/10">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-[#e9eaf2]/65">{t("history.empty")}</p>
            <Button
              className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white"
              render={<Link href="/generate" />}
            >
              {t("history.createFirst")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((v) => (
            <Card
              key={v.id}
              className="overflow-hidden border-white/10 bg-white/[0.05] py-0 ring-white/10"
            >
              <div className="aspect-video bg-gradient-to-br from-violet-900/30 to-cyan-900/20 flex items-center justify-center">
                {v.status === "ready" ? (
                  <Play className="size-10 text-white/40" />
                ) : (
                  <span className="text-xs text-[#e9eaf2]/50">{t("history.generating")}</span>
                )}
              </div>
              <CardContent className="space-y-2 p-4">
                <div className="font-medium text-[#f5f5f7] truncate">
                  {v.input.productName}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#e9eaf2]/55">
                  <BarChart3 className="size-3" />
                  {v.mockViews?.toLocaleString()} {t("history.views")} · {v.mockCtr}% CTR
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" render={<Link href={`/results/${v.id}`} />}>
                    {t("history.open")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteVideo(v.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
