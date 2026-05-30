const SETTINGS_KEY = "viethay_settings";
const API_KEY_PROMPTED_KEY = "viethay_api_key_prompted";

export function getSettings(): { pixverseApiKey: string; vnTone: boolean } {
  if (typeof window === "undefined") {
    return { pixverseApiKey: "", vnTone: true };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { pixverseApiKey: "", vnTone: true };
    return JSON.parse(raw) as { pixverseApiKey: string; vnTone: boolean };
  } catch {
    return { pixverseApiKey: "", vnTone: true };
  }
}

export function saveSettings(settings: {
  pixverseApiKey: string;
  vnTone: boolean;
}): boolean {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

export function hasApiKeyPrompted(): boolean {
  return localStorage.getItem(API_KEY_PROMPTED_KEY) === "1";
}

export function markApiKeyPrompted(): void {
  localStorage.setItem(API_KEY_PROMPTED_KEY, "1");
}
