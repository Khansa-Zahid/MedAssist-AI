import { useTranslation } from "react-i18next";
import type { UrgencyLevel } from "../../types";

interface TriageCardProps {
  urgency: UrgencyLevel;
  disclaimer: string;
  emergencyNumber?: string;
}

const URGENCY_STYLES: Record<
  UrgencyLevel,
  { border: string; bg: string; text: string; dot: string }
> = {
  "self-care": {
    border: "border-sage-300",
    bg: "bg-sage-50",
    text: "text-sage-800",
    dot: "bg-sage-500",
  },
  "see-a-doctor-soon": {
    border: "border-amber-300",
    bg: "bg-amber-100/60",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  "seek-urgent-care": {
    border: "border-clay-300",
    bg: "bg-clay-100",
    text: "text-clay-700",
    dot: "bg-clay-500",
  },
  emergency: {
    border: "border-clay-500",
    bg: "bg-clay-100",
    text: "text-clay-700",
    dot: "bg-clay-500",
  },
  unclear: {
    border: "border-dusk-200",
    bg: "bg-dusk-50",
    text: "text-dusk-700",
    dot: "bg-dusk-400",
  },
};

export function TriageCard({ urgency, disclaimer, emergencyNumber }: TriageCardProps) {
  const { t } = useTranslation();
  const style = URGENCY_STYLES[urgency];
  const isEmergency = urgency === "emergency";

  return (
    <div
      className={`mt-2 max-w-[85%] rounded-2xl border-s-4 ${style.border} ${style.bg} px-4 py-3 shadow-softer`}
    >
      <div className={`flex items-center gap-2 text-sm font-semibold ${style.text}`}>
        <span className={`h-2 w-2 rounded-full ${style.dot}`} aria-hidden="true" />
        {t(`urgency.${urgency}`)}
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{disclaimer}</p>

      {isEmergency && emergencyNumber && (
        <a
          href={`tel:${emergencyNumber}`}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-clay-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-clay-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-.836 1.66l-1.11.554a10.99 10.99 0 005.516 5.516l.554-1.11a1.5 1.5 0 011.66-.836l3.223.716A1.5 1.5 0 0117.5 15.352V16.5a1.5 1.5 0 01-1.5 1.5h-1C7.61 18 2 12.39 2 5.5v-1z" />
          </svg>
          {t("emergency.callButton", { number: emergencyNumber })}
        </a>
      )}
    </div>
  );
}
