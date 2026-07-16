import type { SupportedLanguage } from "../../types";

interface LanguageSwitcherProps {
  value: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
  compact?: boolean;
}

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "عربي" },
  { code: "ur", label: "اردو" },
];

export function LanguageSwitcher({ value, onChange, compact }: LanguageSwitcherProps) {
  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full bg-mist-200/70 p-1 ${
        compact ? "text-xs" : "text-sm"
      }`}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onChange(lang.code)}
          className={`rounded-full px-2.5 py-1 font-medium transition-colors duration-150 ${
            value === lang.code
              ? "bg-white text-sage-700 shadow-softer"
              : "text-ink-400 hover:text-ink-600"
          }`}
          aria-pressed={value === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
