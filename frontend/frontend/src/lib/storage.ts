import type { ChatMessage, UserProfile } from "../types";

const PROFILE_KEY = "aisc:profile";
const HISTORY_KEY = "aisc:history";

export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    // Corrupted or inaccessible storage shouldn't crash the app —
    // just treat it as no saved profile.
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Storage may be full or disabled (e.g. private browsing) — the
    // app should still work for the current session even if it can't persist.
  }
}

export function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
  } catch {
    // Non-fatal — see note above.
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Non-fatal.
  }
}
