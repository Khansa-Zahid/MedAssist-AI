import { useTranslation } from "react-i18next";
import type { View } from "./TabBar";
import type { SupportedLanguage } from "../../types";
import { BreathingLogo } from "./BreathingLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface SidebarProps {
  active: View;
  onChange: (view: View) => void;
  name: string;
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  onNewConversation: () => void;
}

const NAV_ITEMS: View[] = ["chat", "wellness", "settings"];

const ICONS: Record<View, JSX.Element> = {
  chat: (
    <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 3v-3H4a2 2 0 01-2-2V4z" />
  ),
  wellness: (
    <path
      fillRule="evenodd"
      d="M10 2a5 5 0 00-5 5c0 2.5 2 4.5 4 6.5.3.3.7.5 1 .5s.7-.2 1-.5c2-2 4-4 4-6.5a5 5 0 00-5-5zm0 15c-3.3 0-8 1.3-8 3v1h16v-1c0-1.7-4.7-3-8-3z"
      clipRule="evenodd"
    />
  ),
  settings: (
    <path
      fillRule="evenodd"
      d="M11.5 2.3a1.5 1.5 0 00-3 0l-.1.6a6.5 6.5 0 00-1.6.9l-.6-.3a1.5 1.5 0 00-1.9.6l-.7 1.2a1.5 1.5 0 00.4 2l.5.4a6.6 6.6 0 000 1.8l-.5.4a1.5 1.5 0 00-.4 2l.7 1.2a1.5 1.5 0 001.9.6l.6-.3c.5.4 1 .7 1.6.9l.1.6a1.5 1.5 0 003 0l.1-.6c.6-.2 1.1-.5 1.6-.9l.6.3a1.5 1.5 0 001.9-.6l.7-1.2a1.5 1.5 0 00-.4-2l-.5-.4a6.6 6.6 0 000-1.8l.5-.4a1.5 1.5 0 00.4-2l-.7-1.2a1.5 1.5 0 00-1.9-.6l-.6.3a6.5 6.5 0 00-1.6-.9l-.1-.6zM10 13a3 3 0 110-6 3 3 0 010 6z"
      clipRule="evenodd"
    />
  ),
};

export function Sidebar({
  active,
  onChange,
  name,
  language,
  onLanguageChange,
  onNewConversation,
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-e border-mist-200 bg-white/60 px-4 py-5 lg:flex">
      <div className="flex items-center gap-2.5 px-2">
        <BreathingLogo size={30} />
        <div className="min-w-0">
          <p className="truncate font-display text-base font-medium leading-tight text-ink-900">
            {t("app.name")}
          </p>
          <p className="truncate text-[11px] text-ink-400">{t("app.tagline")}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewConversation}
        className="mt-6 flex items-center gap-2 rounded-2xl border border-mist-300 px-3 py-2.5 text-sm font-medium text-ink-600 transition-colors duration-150 hover:border-sage-300 hover:text-sage-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
          <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
        </svg>
        {t("chat.newConversation")}
      </button>

      <nav className="mt-6 flex flex-col gap-1" aria-label="Main">
        {NAV_ITEMS.map((view) => {
          const isActive = active === view;
          return (
            <button
              key={view}
              type="button"
              onClick={() => onChange(view)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive ? "bg-sage-100 text-sage-800" : "text-ink-600 hover:bg-mist-100"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 shrink-0"
                aria-hidden="true"
              >
                {ICONS[view]}
              </svg>
              {t(`nav.${view}`)}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 px-2 pt-6">
        {name && <p className="truncate text-xs text-ink-400">{name}</p>}
        <LanguageSwitcher value={language} onChange={onLanguageChange} compact />
      </div>
    </aside>
  );
}
