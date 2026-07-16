import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { EmergencyRegion, SupportedLanguage, UserProfile } from "../../types";
import { LanguageSwitcher } from "../common/LanguageSwitcher";

interface SettingsViewProps {
  profile: UserProfile;
  onNameChange: (name: string) => void;
  onLanguageChange: (language: SupportedLanguage) => void;
  onEmergencyRegionChange: (region: EmergencyRegion) => void;
  onClearHistory: () => void;
}

export function SettingsView({
  profile,
  onNameChange,
  onLanguageChange,
  onEmergencyRegionChange,
  onClearHistory,
}: SettingsViewProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(profile.name);
  const [justSaved, setJustSaved] = useState(false);

  function handleSave() {
    onNameChange(name.trim());
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  }

  function handleClear() {
    if (window.confirm(t("settings.clearHistoryConfirm"))) {
      onClearHistory();
    }
  }

  return (
    <div className="chat-scroll flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-md">
        <h2 className="font-display text-xl font-medium text-ink-900">{t("settings.title")}</h2>

        <section className="mt-6 rounded-2xl border border-mist-200 bg-white p-5 shadow-softer">
          <h3 className="text-sm font-semibold text-ink-600">{t("settings.profileSection")}</h3>
          <label htmlFor="settings-name" className="mt-3 mb-1.5 block text-sm text-ink-600">
            {t("settings.nameLabel")}
          </label>
          <input
            id="settings-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("settings.namePlaceholder")}
            maxLength={40}
            className="w-full rounded-2xl border border-mist-300 bg-mist-50 px-4 py-2.5 text-ink-900 focus:border-sage-400 focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSave}
            className="mt-3 rounded-full bg-sage-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-sage-600"
          >
            {justSaved ? t("settings.saved") : t("settings.saveButton")}
          </button>

          <h3 className="mt-6 text-sm font-semibold text-ink-600">{t("settings.languageLabel")}</h3>
          <div className="mt-2">
            <LanguageSwitcher value={profile.language} onChange={onLanguageChange} />
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-mist-200 bg-white p-5 shadow-softer">
          <h3 className="text-sm font-semibold text-ink-600">{t("settings.emergencyRegionLabel")}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-400">
            {t("settings.emergencyRegionNote")}
          </p>
          <div className="mt-3 inline-flex rounded-full bg-mist-100 p-1">
            <button
              type="button"
              onClick={() => onEmergencyRegionChange("uk")}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
                profile.emergencyRegion === "uk"
                  ? "bg-white text-sage-700 shadow-softer"
                  : "text-ink-400 hover:text-ink-600"
              }`}
              aria-pressed={profile.emergencyRegion === "uk"}
            >
              {t("settings.emergencyRegionUk")}
            </button>
            <button
              type="button"
              onClick={() => onEmergencyRegionChange("uae")}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
                profile.emergencyRegion === "uae"
                  ? "bg-white text-sage-700 shadow-softer"
                  : "text-ink-400 hover:text-ink-600"
              }`}
              aria-pressed={profile.emergencyRegion === "uae"}
            >
              {t("settings.emergencyRegionUae")}
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-mist-200 bg-white p-5 shadow-softer">
          <h3 className="text-sm font-semibold text-ink-600">{t("settings.dataSection")}</h3>
          <p className="mt-2 text-xs leading-relaxed text-ink-400">{t("settings.dataNote")}</p>
          <button
            type="button"
            onClick={handleClear}
            className="mt-3 rounded-full border border-clay-300 px-4 py-2 text-sm font-medium text-clay-700 transition-colors duration-150 hover:bg-clay-100"
          >
            {t("settings.clearHistoryButton")}
          </button>
        </section>

        <section className="mt-4 rounded-2xl border border-mist-200 bg-white p-5 shadow-softer">
          <h3 className="text-sm font-semibold text-ink-600">{t("settings.aboutSection")}</h3>
          <p className="mt-2 text-xs leading-relaxed text-ink-400">{t("settings.aboutBody")}</p>
        </section>
      </div>
    </div>
  );
}
