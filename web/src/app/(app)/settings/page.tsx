"use client";

import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientReady } from "@/hooks/use-client-store";
import { useTranslation } from "@/hooks/use-translation";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { getSettings, saveSettings } from "@/lib/storage";

function maskKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "••••";
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}

function SettingsForm() {
  const { t } = useTranslation();
  const s = getSettings();
  const [apiKey, setApiKey] = useState(s.pixverseApiKey);
  const [vnTone, setVnTone] = useState(s.vnTone);
  const [savedKey, setSavedKey] = useState(s.pixverseApiKey);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  function handleSave() {
    const key = apiKey.trim();
    const ok = saveSettings({ pixverseApiKey: key, vnTone });
    if (ok) {
      setApiKey(key);
      setSavedKey(key);
      setSaved(true);
      setError(false);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(true);
    }
  }

  function handleClear() {
    saveSettings({ pixverseApiKey: "", vnTone });
    setApiKey("");
    setSavedKey("");
  }

  return (
    <div className="max-w-lg space-y-4">
      <Card className="border-white/10 bg-white/[0.05] ring-white/10">
        <CardHeader>
          <CardTitle className="text-base">{t("settings.language")}</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageToggle />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.05] ring-white/10">
        <CardHeader>
          <CardTitle className="text-base">{t("settings.apiKey")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              placeholder={t("settings.apiKeyPh")}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 pr-10 text-sm text-[#f5f5f7] outline-none transition-colors placeholder:text-[#e9eaf2]/40 focus:border-[#ff8a3d]/50"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#e9eaf2]/50 hover:text-[#e9eaf2]"
              aria-label={show ? "Hide" : "Show"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {savedKey ? (
            <p className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Check className="size-3.5" />
              {t("settings.savedKey")}: <span className="font-mono">{maskKey(savedKey)}</span>
            </p>
          ) : (
            <p className="text-xs text-[#e9eaf2]/45">{t("settings.noKey")}</p>
          )}

          <label className="flex items-center gap-2 text-sm text-[#e9eaf2]/80">
            <input
              type="checkbox"
              checked={vnTone}
              onChange={(e) => setVnTone(e.target.checked)}
              className="rounded"
            />
            {t("settings.vnTone")}
          </label>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white"
            >
              {saved ? t("settings.saved") : t("settings.save")}
            </Button>
            {savedKey && (
              <Button variant="ghost" onClick={handleClear}>
                {t("settings.clear")}
              </Button>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-400">{t("settings.saveError")}</p>
          )}
          <p className="text-xs text-[#e9eaf2]/50">{t("settings.note")}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsHeader() {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      <h1 className="text-lg font-semibold text-[#f5f5f7]">{t("settings.title")}</h1>
      <p className="text-xs text-[#e9eaf2]/60">{t("settings.subtitle")}</p>
    </div>
  );
}

export default function SettingsPage() {
  const ready = useClientReady();

  return (
    <main className="flex-1 p-4 md:p-6">
      {ready ? (
        <>
          <SettingsHeader />
          <SettingsForm />
        </>
      ) : (
        <div className="h-40 max-w-lg animate-pulse rounded-xl bg-white/5" />
      )}
    </main>
  );
}
