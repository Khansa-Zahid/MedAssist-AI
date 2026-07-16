import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "../../types";
import { BreathingLogo } from "../common/BreathingLogo";
import { LanguageSwitcher } from "../common/LanguageSwitcher";

interface HeaderProps {
  name: string;
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  onNewConversation: () => void;
}

export function Header({ name, language, onLanguageChange, onNewConversation }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between gap-3 border-b border-mist-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6 lg:hidden">
      <div className="flex min-w-0 items-center gap-2.5">
        <BreathingLogo size={26} />
        <div className="min-w-0">
          <h1 className="truncate font-display text-base font-medium leading-tight text-ink-900 sm:text-lg">
            {t("app.name")}
          </h1>
          {name && (
            <p className="truncate text-xs text-ink-400">{name}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onNewConversation}
          className="hidden rounded-full border border-mist-300 px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors duration-150 hover:border-sage-300 hover:text-sage-700 sm:inline-block"
        >
          {t("chat.newConversation")}
        </button>
        <button
          type="button"
          onClick={onNewConversation}
          aria-label={t("chat.newConversation")}
          className="inline-flex rounded-full border border-mist-300 p-2 text-ink-600 transition-colors duration-150 hover:border-sage-300 hover:text-sage-700 sm:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
          </svg>
        </button>
        <LanguageSwitcher value={language} onChange={onLanguageChange} compact />
      </div>
    </header>
  );
}
