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
import { Input } from "@/components/ui/input";
import { useClientReady } from "@/hooks/use-client-store";
import {
  getSettings,
  hasApiKeyPrompted,
  markApiKeyPrompted,
  saveSettings,
} from "@/lib/storage";

function ApiKeyPrompt() {
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
          <DialogTitle>PixVerse API Key</DialogTitle>
          <DialogDescription className="text-[#e9eaf2]/65">
            Nhập API key từ{" "}
            <a
              href="https://app.pixverse.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff8a3d] underline"
            >
              PixVerse
            </a>{" "}
            để tạo video thật. Bỏ qua để dùng chế độ demo.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="password"
          placeholder="sk-..."
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="border-white/10 bg-white/5"
        />
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleSkip}>
            Bỏ qua (Demo)
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white hover:opacity-90"
          >
            Lưu key
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
