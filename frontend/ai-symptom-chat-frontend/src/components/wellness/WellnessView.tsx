import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type BreathPhase = "in" | "hold" | "out";

const PHASE_DURATIONS: Record<BreathPhase, number> = {
  in: 4000,
  hold: 4000,
  out: 4000,
};

const PHASE_ORDER: BreathPhase[] = ["in", "hold", "out"];

export function WellnessView() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<BreathPhase>("in");

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentIndex = PHASE_ORDER.indexOf(phase);
      const nextPhase = PHASE_ORDER[(currentIndex + 1) % PHASE_ORDER.length];
      setPhase(nextPhase);
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(timer);
  }, [phase]);

  const phaseLabel =
    phase === "in" ? t("wellness.breatheIn") : phase === "hold" ? t("wellness.breatheHold") : t("wellness.breatheOut");

  const circleScale = phase === "in" ? "scale-100" : phase === "hold" ? "scale-100" : "scale-[0.55]";

  const tips = [
    { title: t("wellness.tip1Title"), body: t("wellness.tip1Body"), icon: "💧" },
    { title: t("wellness.tip2Title"), body: t("wellness.tip2Body"), icon: "🌙" },
    { title: t("wellness.tip3Title"), body: t("wellness.tip3Body"), icon: "🚶" },
  ];

  return (
    <div className="chat-scroll flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-md text-center">
        <h2 className="font-display text-xl font-medium text-ink-900">{t("wellness.title")}</h2>
        <p className="mt-1.5 text-sm text-ink-400">{t("wellness.subtitle")}</p>

        <div className="mx-auto mt-8 flex h-56 w-56 items-center justify-center">
          <div className="relative flex h-44 w-44 items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-sage-200/70 transition-transform ease-in-out ${circleScale}`}
              style={{ transitionDuration: `${PHASE_DURATIONS[phase]}ms` }}
              aria-hidden="true"
            />
            <div
              className={`absolute inset-6 rounded-full bg-sage-300/80 transition-transform ease-in-out ${circleScale}`}
              style={{ transitionDuration: `${PHASE_DURATIONS[phase]}ms` }}
              aria-hidden="true"
            />
            <span className="relative font-display text-lg font-medium text-sage-800">
              {phaseLabel}
            </span>
          </div>
        </div>

        <h3 className="mt-10 text-left font-display text-base font-medium text-ink-900 rtl:text-right">
          {t("wellness.tipsTitle")}
        </h3>
        <div className="mt-3 space-y-2.5">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="flex items-start gap-3 rounded-2xl border border-mist-200 bg-white px-4 py-3 text-left shadow-softer rtl:text-right"
            >
              <span className="text-xl" aria-hidden="true">
                {tip.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-ink-900">{tip.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-400">{tip.body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-ink-400">{t("wellness.disclaimer")}</p>
      </div>
    </div>
  );
}
