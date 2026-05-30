"use client";

import { useCallback } from "react";
import { useExternalStore } from "./use-client-store";
import { getLang, setLang, subscribeLang } from "@/lib/lang-store";
import { translate, type Lang, type TranslationKey } from "@/lib/i18n";

export function useTranslation() {
  const lang = useExternalStore<Lang>(subscribeLang, getLang, () => "vi");

  const t = useCallback(
    (key: TranslationKey) => translate(lang, key),
    [lang]
  );

  const toggle = useCallback(() => {
    setLang(lang === "vi" ? "en" : "vi");
  }, [lang]);

  return { lang, t, setLang, toggle };
}
