import { useTranslation } from "react-i18next";

export function TypingIndicator() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 self-start rounded-2xl rounded-ss-sm border border-mist-200 bg-white px-4 py-3 shadow-softer">
      <span className="flex gap-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-sage-400" style={{ animationDelay: "0s" }} />
        <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-sage-400" style={{ animationDelay: "0.3s" }} />
        <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-sage-400" style={{ animationDelay: "0.6s" }} />
      </span>
      <span className="text-xs text-ink-400">{t("chat.thinking")}</span>
    </div>
  );
}
