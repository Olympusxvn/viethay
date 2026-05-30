"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { generateScript } from "@/lib/script-generator";
import { getSettings } from "@/lib/storage";
import { useTranslation } from "@/hooks/use-translation";
import type { TranslationKey } from "@/lib/i18n";
import {
  createVideo,
  simulateVideoGeneration,
  updateVideo,
} from "@/lib/video-store";
import { startPixverseGeneration, hasServerKey } from "@/lib/pixverse-client";
import type { GenerateInput, GeneratedScript, VideoGoal, VideoStyle } from "@/lib/types";

const STYLES: { id: VideoStyle; labelKey: TranslationKey }[] = [
  { id: "tiktok", labelKey: "style.tiktok" },
  { id: "shopee", labelKey: "style.shopee" },
  { id: "premium", labelKey: "style.premium" },
  { id: "funny", labelKey: "style.funny" },
  { id: "lazada", labelKey: "style.lazada" },
];

const GOALS: { id: VideoGoal; label: string }[] = [
  { id: "shopee", label: "Shopee" },
  { id: "tiktok", label: "TikTok" },
  { id: "lazada", label: "Lazada" },
];

export function GenerateForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<VideoStyle>("tiktok");
  const [goal, setGoal] = useState<VideoGoal>("tiktok");
  const [images, setImages] = useState<string[]>([]);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "preview">("form");

  const onFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .slice(0, 6)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          if (typeof dataUrl === "string") {
            setImages((prev) => [...prev, dataUrl].slice(0, 6));
          }
        };
        reader.readAsDataURL(file);
      });
  }, []);

  function handlePreviewScript() {
    const input: GenerateInput = {
      productName,
      description,
      style,
      goal,
      imageDataUrls: images,
    };
    setScript(generateScript(input));
    setStep("preview");
  }

  async function handleGenerate() {
    const input: GenerateInput = {
      productName,
      description,
      style,
      goal,
      imageDataUrls: images,
    };
    const generatedScript = script ?? generateScript(input);
    setLoading(true);
    const project = createVideo(input, generatedScript);
    const apiKey = getSettings().pixverseApiKey;
    const useReal = Boolean(apiKey) || (await hasServerKey());

    if (useReal) {
      try {
        const videoId = await startPixverseGeneration(apiKey || undefined, {
          prompt: generatedScript.finalPrompt,
          negativePrompt: generatedScript.negativePrompt,
          aspectRatio: "9:16",
          duration: 8,
          quality: "540p",
          model: "v4.5",
        });
        updateVideo(project.id, { pixverseId: videoId, real: true });
      } catch {
        // PixVerse unavailable (bad key / no credits) — fall back to demo
        await simulateVideoGeneration(project.id, false);
      }
    } else {
      await simulateVideoGeneration(project.id, false);
    }

    setLoading(false);
    router.push(`/results/${project.id}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#f5f5f7]">{t("gen.title")}</h1>
          <p className="text-xs text-[#e9eaf2]/60">{t("gen.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-white/10 bg-white/5 text-[#e9eaf2]/75">
            {t("gen.credits")}: 12
          </Badge>
          <Badge variant="outline" className="border-white/10 bg-white/5 text-[#e9eaf2]/75">
            {t("gen.vnTone")}: {t("gen.on")}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/[0.06] py-0 ring-white/10">
          <CardHeader className="border-b border-white/8 py-3">
            <CardTitle className="text-sm text-[#e9eaf2]/70">{t("gen.productAssets")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onFiles(e.dataTransfer.files);
              }}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/18 bg-black/25 p-4 transition-colors hover:border-[#ff8a3d]/40"
            >
              <div className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/25 to-cyan-500/15">
                <Upload className="size-5 text-[#e9eaf2]/80" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#f5f5f7]">{t("gen.dropImages")}</div>
                <div className="text-xs text-[#e9eaf2]/60">{t("gen.dropHint")}</div>
              </div>
              <Button size="sm" variant="outline" type="button">
                {t("gen.browse")}
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((src, i) => (
                  <div
                    key={i}
                    role="img"
                    aria-label={`Preview ${i + 1}`}
                    className="size-16 rounded-lg border border-white/10 bg-cover bg-center"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                ))}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-[#e9eaf2]/60">
                  {t("gen.productName")}
                </label>
                <Input
                  placeholder={t("gen.productNamePh")}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="border-white/10 bg-white/[0.06]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-[#e9eaf2]/60">{t("gen.goal")}</label>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition-colors",
                        goal === g.id
                          ? "border-white/12 bg-gradient-to-r from-[#ff4d4d]/25 to-[#ff8a3d]/15"
                          : "border-white/10 bg-white/[0.04]"
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-[#e9eaf2]/60">
                {t("gen.description")}
              </label>
              <Textarea
                placeholder={t("gen.descriptionPh")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] border-white/10 bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-[#e9eaf2]/60">{t("gen.style")}</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      style === s.id
                        ? "border-white/12 bg-gradient-to-r from-violet-500/25 to-cyan-500/15"
                        : "border-white/10 bg-white/[0.04]"
                    )}
                  >
                    {t(s.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {step === "form" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviewScript}
                  disabled={!productName.trim()}
                >
                  {t("gen.previewScript")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("form")}
                >
                  {t("gen.editInputs")}
                </Button>
              )}
              <Button
                type="button"
                disabled={loading || !productName.trim()}
                onClick={handleGenerate}
                className="min-w-[180px] bg-gradient-to-r from-[#ff4d4d] via-[#ff8a3d] to-[#ffd15c] px-6 text-[#0b0d12] hover:opacity-90"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t("gen.generating")}
                  </>
                ) : (
                  t("gen.generate")
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04] py-0 ring-white/10">
          <CardHeader className="border-b border-white/8 py-3">
            <CardTitle className="text-sm text-[#e9eaf2]/70">
              {step === "preview" ? t("gen.scriptStoryboard") : t("gen.livePreview")}
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[520px] space-y-3 overflow-y-auto pt-4">
            {script && step === "preview" ? (
              <>
                <p className="text-sm font-medium text-[#ff8a3d]">{script.hook}</p>
                {script.shots.map((shot) => (
                  <div
                    key={shot.id}
                    className="rounded-xl border border-white/8 bg-black/20 p-3"
                  >
                    <div className="flex justify-between text-xs text-[#e9eaf2]/55">
                      <span>{shot.title}</span>
                      <span>{shot.durationSec}s</span>
                    </div>
                    <p className="mt-1 text-xs text-[#e9eaf2]/85">{shot.prompt}</p>
                    <p className="mt-1 text-[10px] text-[#e9eaf2]/50">{shot.camera}</p>
                  </div>
                ))}
                <div className="rounded-xl border border-white/8 bg-black/30 p-3 text-xs">
                  <div className="mb-1 font-medium text-[#e9eaf2]/60">{t("gen.pixversePrompt")}</div>
                  <p className="text-[#e9eaf2]/90">{script.finalPrompt}</p>
                </div>
              </>
            ) : (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 bg-black/20 p-6 text-center">
                <ClapperboardIcon />
                <p className="mt-3 text-sm text-[#e9eaf2]/65">{t("gen.placeholder")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClapperboardIcon() {
  return (
    <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/15">
      <span className="text-2xl">🎬</span>
    </div>
  );
}
