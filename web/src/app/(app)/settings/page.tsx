"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientReady } from "@/hooks/use-client-store";
import { getSettings, saveSettings } from "@/lib/storage";

function SettingsForm() {
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
    <Card className="max-w-lg border-white/10 bg-white/[0.05] ring-white/10">
      <CardHeader>
        <CardTitle className="text-base">PixVerse API Key</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="password"
          placeholder="Nhập PixVerse API key"
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
          Vietnamese cultural tone (VN Tone)
        </label>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white"
        >
          {saved ? "Đã lưu ✓" : "Lưu cài đặt"}
        </Button>
        <p className="text-xs text-[#e9eaf2]/50">
          Không có key → chế độ demo với video mẫu. Có key → sẵn sàng tích hợp
          PixVerse API trong phiên bản tiếp theo.
        </p>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const ready = useClientReady();

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#f5f5f7]">Settings</h1>
        <p className="text-xs text-[#e9eaf2]/60">
          API key lưu localStorage — tiện cho judge tự demo
        </p>
      </div>
      {ready ? <SettingsForm /> : <div className="h-40 animate-pulse rounded-xl bg-white/5" />}
    </main>
  );
}
