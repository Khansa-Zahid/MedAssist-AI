import { useTranslation } from "react-i18next";

export function DisclaimerBanner() {
  const { t } = useTranslation();

  return (
    <div
      role="note"
      className="flex items-start gap-2 border-b border-sage-200/60 bg-sage-50 px-4 py-2.5 text-xs text-sage-800 sm:text-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="mt-0.5 h-4 w-4 shrink-0 text-sage-500"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <span>{t("disclaimer.banner")}</span>
    </div>
  );
}
