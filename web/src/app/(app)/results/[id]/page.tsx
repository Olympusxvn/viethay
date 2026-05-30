"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Download, Copy, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useExternalStore } from "@/hooks/use-client-store";
import { useTranslation } from "@/hooks/use-translation";
import { getVideo, subscribeVideos } from "@/lib/video-store";

export default function ResultPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params.id as string;
  const getSnapshot = useCallback(() => getVideo(id), [id]);
  const project = useExternalStore(
    subscribeVideos,
    getSnapshot,
    () => undefined
  );
  const [subs, setSubs] = useState(() =>
    project?.script.subtitles
      ? project.script.subtitles
          .map((s) => `[${s.start}s-${s.end}s] ${s.text}`)
          .join("\n")
      : ""
  );

  if (!project) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-[#e9eaf2]/70">{t("result.notFound")}</p>
        <Link
          href="/history"
          className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm text-primary-foreground"
        >
          {t("result.history")}
        </Link>
      </main>
    );
  }

  const isGenerating = project.status === "generating";
  const subtitleDefault = project.script.subtitles
    .map((s) => `[${s.start}s-${s.end}s] ${s.text}`)
    .join("\n");

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/history"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-[#e9eaf2]/80 hover:bg-white/5"
        >
          <ArrowLeft className="size-4" />
          {t("result.history")}
        </Link>
        <Badge variant="outline" className="border-white/10">
          {project.input.productName}
        </Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <Card className="overflow-hidden border-white/10 bg-black/30 py-0 ring-white/10">
          <CardContent className="p-0">
            <div className="relative aspect-[9/16] max-h-[70vh] w-full bg-black md:aspect-video md:max-h-none">
              {isGenerating ? (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3">
                  <Loader2 className="size-10 animate-spin text-[#ff8a3d]" />
                  <p className="text-sm text-[#e9eaf2]/70">{t("result.rendering")}</p>
                </div>
              ) : project.videoUrl ? (
                <video
                  src={project.videoUrl}
                  controls
                  className="h-full w-full object-contain"
                  playsInline
                />
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-white/8 p-4">
              {project.videoUrl ? (
                <a
                  href={project.videoUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] px-4 text-sm text-white"
                >
                  <Download className="size-4" />
                  {t("result.download")}
                </a>
              ) : (
                <Button disabled className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white">
                  <Download className="size-4" />
                  {t("result.download")}
                </Button>
              )}
              <Button
                variant="outline"
                disabled={!project.videoUrl}
                onClick={() => {
                  if (project.videoUrl) navigator.clipboard.writeText(project.videoUrl);
                }}
              >
                <Copy className="size-4" />
                {t("result.copyLink")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-white/10 bg-white/[0.04] py-0 ring-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">{t("result.analytics")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 pb-4">
              <Stat label={t("result.views")} value={String(project.mockViews ?? 0)} />
              <Stat label={t("result.ctr")} value={String(project.mockCtr ?? 0)} />
              <Stat label={t("result.duration")} value="30s+" />
              <Stat label={t("result.platform")} value={project.input.goal} />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] py-0 ring-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">{t("result.subtitleEditor")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <Textarea
                key={project.id + project.status}
                defaultValue={subs || subtitleDefault}
                onChange={(e) => setSubs(e.target.value)}
                className="min-h-[140px] border-white/10 bg-black/20 font-mono text-xs"
              />
              <p className="mt-2 text-xs text-[#e9eaf2]/50">{t("result.subtitleHint")}</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] py-0 ring-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">{t("result.abVariant")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 text-xs text-[#e9eaf2]/65">
              {t("result.abDesc")}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-3">
      <div className="text-xs text-[#e9eaf2]/55">{label}</div>
      <div className="text-lg font-semibold text-[#f5f5f7]">{value}</div>
    </div>
  );
}
