import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "../../types";
import { BreathingLogo } from "../common/BreathingLogo";
import { LanguageSwitcher } from "../common/LanguageSwitcher";

interface ProfileSetupProps {
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  onComplete: (name: string, language: SupportedLanguage) => void;
}

export function ProfileSetup({ language, onLanguageChange, onComplete }: ProfileSetupProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [consented, setConsented] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);

  function handleSubmit(withName: boolean) {
    if (!consented) {
      setShowConsentError(true);
      return;
    }
    onComplete(withName ? name : "", language);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist-100 px-4 py-10">
      <div className="w-full max-w-md animate-fade-in-up rounded-3xl bg-white p-8 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BreathingLogo size={30} />
            <span className="font-display text-lg font-medium text-ink-900">
              {t("app.name")}
            </span>
          </div>
          <LanguageSwitcher value={language} onChange={onLanguageChange} compact />
        </div>

        <h1 className="font-display text-2xl font-medium text-ink-900">
          {t("profile.welcomeTitle")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          {t("profile.welcomeSubtitle")}
        </p>

        <div className="mt-6">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-600">
            {t("profile.nameLabel")}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("profile.namePlaceholder")}
            maxLength={40}
            className="w-full rounded-2xl border border-mist-300 bg-mist-50 px-4 py-3 text-ink-900 placeholder:text-ink-400/70 focus:border-sage-400 focus:bg-white focus:outline-none"
          />
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => {
              setConsented(e.target.checked);
              if (e.target.checked) setShowConsentError(false);
            }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-mist-300 text-sage-500 focus:ring-sage-400"
          />
          <span>{t("disclaimer.consent")}</span>
        </label>
        {showConsentError && (
          <p className="mt-1.5 text-xs text-clay-500">{t("profile.consentRequired")}</p>
        )}

        <div className="mt-7 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="w-full rounded-2xl bg-sage-500 px-4 py-3 font-medium text-white transition-colors duration-150 hover:bg-sage-600 focus-visible:outline-offset-2"
          >
            {t("profile.continueButton")}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="w-full rounded-2xl px-4 py-2.5 text-sm font-medium text-ink-400 transition-colors duration-150 hover:text-ink-600"
          >
            {t("profile.continueAsGuest")}
          </button>
        </div>
      </div>
    </div>
  );
}
