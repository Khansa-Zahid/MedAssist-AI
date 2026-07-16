import { useTranslation } from "react-i18next";
import type { ChatErrorKind } from "../../hooks/useChat";

interface ErrorBannerProps {
  kind: ChatErrorKind;
  onRetry: () => void;
}

export function ErrorBanner({ kind, onRetry }: ErrorBannerProps) {
  const { t } = useTranslation();
  if (!kind) return null;

  const message = kind === "rate_limited" ? t("chat.rateLimited") : t("chat.errorGeneric");

  return (
    <div className="flex flex-col gap-2 self-start rounded-2xl border border-clay-300 bg-clay-100 px-4 py-3 text-sm text-clay-700 sm:flex-row sm:items-center sm:gap-3">
      <span>{message}</span>
      {kind !== "rate_limited" && (
        <button
          type="button"
          onClick={onRetry}
          className="self-start rounded-full bg-clay-500 px-3 py-1 text-xs font-medium text-white transition-colors duration-150 hover:bg-clay-700 sm:self-auto"
        >
          {t("chat.errorRetry")}
        </button>
      )}
    </div>
  );
}
