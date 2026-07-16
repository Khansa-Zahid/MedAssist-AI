import { useTranslation } from "react-i18next";

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  const { t } = useTranslation();
  const suggestions = [
    t("chat.suggestion1"),
    t("chat.suggestion2"),
    t("chat.suggestion3"),
    t("chat.suggestion4"),
  ];

  return (
    <div className="mt-1">
      <p className="mb-2 text-xs font-medium text-ink-400">{t("chat.suggestionsTitle")}</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onSelect(text)}
            className="rounded-full border border-sage-200 bg-sage-50 px-3.5 py-1.5 text-sm text-sage-800 transition-colors duration-150 hover:border-sage-400 hover:bg-sage-100"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
