import type { Lang } from "./i18n";

const LANG_KEY = "viethay_lang";
const EVENT = "viethay-lang-changed";

export function getLang(): Lang {
  if (typeof window === "undefined") return "vi";
  const stored = localStorage.getItem(LANG_KEY);
  return stored === "en" ? "en" : "vi";
}

export function setLang(lang: Lang): void {
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeLang(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
