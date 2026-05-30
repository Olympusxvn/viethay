"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Download, Copy, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useExternalStore } from "@/hooks/use-client-store";
import { getVideo } from "@/lib/video-store";

function subscribeVideos(onChange: () => void) {
  window.addEventListener("viethay-videos-updated", onChange);
  return () => window.removeEventListener("viethay-videos-updated", onChange);
}

export default function ResultPage() {
  const params = useParams();
  const id = params.id as string;
  const project = useExternalStore(
    subscribeVideos,
    () => getVideo(id),
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
        <p className="text-[#e9eaf2]/70">Video không tìm thấy.</p>
        <Link
          href="/history"
          className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm text-primary-foreground"
        >
          Xem History
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
          History
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
                  <p className="text-sm text-[#e9eaf2]/70">
                    PixVerse đang render video 30s+…
                  </p>
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
                  Download
                </a>
              ) : (
                <Button disabled className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white">
                  <Download className="size-4" />
                  Download
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
                Copy link
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-white/10 bg-white/[0.04] py-0 ring-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Mock Analytics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 pb-4">
              <Stat label="Views (sim)" value={String(project.mockViews ?? 0)} />
              <Stat label="CTR %" value={String(project.mockCtr ?? 0)} />
              <Stat label="Duration" value="30s+" />
              <Stat label="Platform" value={project.input.goal} />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] py-0 ring-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Subtitle editor</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <Textarea
                key={project.id + project.status}
                defaultValue={subs || subtitleDefault}
                onChange={(e) => setSubs(e.target.value)}
                className="min-h-[140px] border-white/10 bg-black/20 font-mono text-xs"
              />
              <p className="mt-2 text-xs text-[#e9eaf2]/50">
                Mock dubbing — chỉnh phụ đề trước khi export
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] py-0 ring-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">A/B variant</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 text-xs text-[#e9eaf2]/65">
              Version A (current) vs Version B — tạo biến thể hook khác từ Generate.
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
