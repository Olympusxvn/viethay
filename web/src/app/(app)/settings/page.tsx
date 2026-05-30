"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientReady } from "@/hooks/use-client-store";
import { useTranslation } from "@/hooks/use-translation";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { getSettings, saveSettings } from "@/lib/storage";

function SettingsForm() {
  const { t } = useTranslation();
  const s = getSettings();
  const [apiKey, setApiKey] = useState(s.pixverseApiKey);
  const [vnTone, setVnTone] = useState(s.vnTone);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    saveSettings({ pixverseApiKey: apiKey.trim(), vnTone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder={t("settings.apiKeyPh")}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border-white/10 bg-white/[0.06]"
          />
          <label className="flex items-center gap-2 text-sm text-[#e9eaf2]/80">
            <input
              type="checkbox"
              checked={vnTone}
              onChange={(e) => setVnTone(e.target.checked)}
              className="rounded"
            />
            {t("settings.vnTone")}
          </label>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white"
          >
            {saved ? t("settings.saved") : t("settings.save")}
          </Button>
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
