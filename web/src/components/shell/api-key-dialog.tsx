"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useClientReady } from "@/hooks/use-client-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  getSettings,
  hasApiKeyPrompted,
  markApiKeyPrompted,
  saveSettings,
} from "@/lib/storage";

function ApiKeyPrompt() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(
    () => !hasApiKeyPrompted() && !getSettings().pixverseApiKey
  );
  const [key, setKey] = useState("");

  function handleSave() {
    const s = getSettings();
    saveSettings({ ...s, pixverseApiKey: key.trim() });
    markApiKeyPrompted();
    setOpen(false);
  }

  function handleSkip() {
    markApiKeyPrompted();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-white/10 bg-[#12131f] text-[#f5f5f7] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription className="text-[#e9eaf2]/65">
            {t("dialog.descPre")}{" "}
            <a
              href="https://app.pixverse.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff8a3d] underline"
            >
              PixVerse
            </a>{" "}
            {t("dialog.descPost")}
          </DialogDescription>
        </DialogHeader>
        <input
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="sk-..."
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-[#f5f5f7] outline-none placeholder:text-[#e9eaf2]/40 focus:border-[#ff8a3d]/50"
        />
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleSkip}>
            {t("dialog.skip")}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white hover:opacity-90"
          >
            {t("dialog.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ApiKeyDialog() {
  const ready = useClientReady();
  if (!ready) return null;
  return <ApiKeyPrompt />;
}
