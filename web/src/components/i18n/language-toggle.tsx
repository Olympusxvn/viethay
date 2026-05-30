"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/use-client-store";
import { useTranslation } from "@/hooks/use-translation";

export function LanguageToggle({ className }: { className?: string }) {
  const ready = useClientReady();
  const { lang, setLang } = useTranslation();

  if (!ready) {
    return (
      <div
        className={cn(
          "h-8 w-[88px] rounded-lg border border-white/10 bg-white/5",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5",
        className
      )}
    >
      <Globe className="ml-1.5 size-3.5 text-[#e9eaf2]/60" />
      <button
        type="button"
        onClick={() => setLang("vi")}
        className={cn(
          "rounded-md px-2 py-1 text-xs font-medium transition-colors",
          lang === "vi"
            ? "bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-[#0b0d12]"
            : "text-[#e9eaf2]/70 hover:text-[#f5f5f7]"
        )}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "rounded-md px-2 py-1 text-xs font-medium transition-colors",
          lang === "en"
            ? "bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-[#0b0d12]"
            : "text-[#e9eaf2]/70 hover:text-[#f5f5f7]"
        )}
      >
        EN
      </button>
    </div>
  );
}
