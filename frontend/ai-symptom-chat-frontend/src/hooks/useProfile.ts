import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { EmergencyRegion, SupportedLanguage, UserProfile } from "../types";
import { loadProfile, saveProfile } from "../lib/storage";
import { RTL_LANGUAGES } from "../i18n";

export function useProfile() {
  const { i18n } = useTranslation();
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const loaded = loadProfile();
    // Defensive default for profiles saved before emergencyRegion existed.
    if (loaded && !loaded.emergencyRegion) {
      return { ...loaded, emergencyRegion: "uk" };
    }
    return loaded;
  });

  const applyLanguage = useCallback(
    (language: SupportedLanguage) => {
      i18n.changeLanguage(language);
      document.documentElement.lang = language;
      document.documentElement.dir = RTL_LANGUAGES.includes(language)
        ? "rtl"
        : "ltr";
    },
    [i18n]
  );

  useEffect(() => {
    if (profile) {
      applyLanguage(profile.language);
    }
  }, [profile, applyLanguage]);

  const completeProfile = useCallback(
    (name: string, language: SupportedLanguage) => {
      const newProfile: UserProfile = {
        name: name.trim(),
        language,
        emergencyRegion: language === "ar" ? "uae" : "uk",
        hasAcceptedDisclaimer: true,
        createdAt: Date.now(),
      };
      saveProfile(newProfile);
      setProfileState(newProfile);
      applyLanguage(language);
    },
    [applyLanguage]
  );

  const updateLanguage = useCallback(
    (language: SupportedLanguage) => {
      if (!profile) {
        applyLanguage(language);
        return;
      }
      const updated = { ...profile, language };
      saveProfile(updated);
      setProfileState(updated);
      applyLanguage(language);
    },
    [profile, applyLanguage]
  );

  const updateName = useCallback(
    (name: string) => {
      if (!profile) return;
      const updated = { ...profile, name };
      saveProfile(updated);
      setProfileState(updated);
    },
    [profile]
  );

  const updateEmergencyRegion = useCallback(
    (emergencyRegion: EmergencyRegion) => {
      if (!profile) return;
      const updated = { ...profile, emergencyRegion };
      saveProfile(updated);
      setProfileState(updated);
    },
    [profile]
  );

  return { profile, completeProfile, updateLanguage, updateName, updateEmergencyRegion };
}
