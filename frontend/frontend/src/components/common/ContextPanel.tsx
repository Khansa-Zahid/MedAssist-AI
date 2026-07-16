import { useTranslation } from "react-i18next";
import type { ChatMessage } from "../../types";
import type { View } from "./TabBar";
import { TriageCard } from "../chat/TriageCard";
import { BreathingLogo } from "./BreathingLogo";
import { UrgencyTimeline } from "./UrgencyTimeline";

interface ContextPanelProps {
  view: View;
  messages: ChatMessage[];
  latestAssistantMessage: ChatMessage | null;
  emergencyNumber: string;
  onOpenWellness: () => void;
}

export function ContextPanel({
  view,
  messages,
  latestAssistantMessage,
  emergencyNumber,
  onOpenWellness,
}: ContextPanelProps) {
  const { t } = useTranslation();

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-4 overflow-y-auto border-s border-mist-200 bg-white/60 px-4 py-5 lg:flex">
      {view === "chat" && (
        <>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
              {t("context.statusTitle")}
            </h3>
            {latestAssistantMessage?.urgency && latestAssistantMessage.disclaimer ? (
              <TriageCard
                urgency={latestAssistantMessage.urgency}
                disclaimer={latestAssistantMessage.disclaimer}
                emergencyNumber={emergencyNumber}
              />
            ) : (
              <p className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-xs leading-relaxed text-ink-400 shadow-softer">
                {t("context.noAssessment")}
              </p>
            )}
          </section>

          <UrgencyTimeline messages={messages} />
        </>
      )}

      <section className="rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3">
        <p className="text-xs leading-relaxed text-sage-800">{t("disclaimer.banner")}</p>
      </section>

      <section className="mt-auto rounded-2xl border border-mist-200 bg-white px-4 py-3 shadow-softer">
        <div className="flex items-center gap-2">
          <BreathingLogo size={20} />
          <p className="text-sm font-medium text-ink-900">{t("context.wellnessTeaserTitle")}</p>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-400">
          {t("context.wellnessTeaserBody")}
        </p>
        <button
          type="button"
          onClick={onOpenWellness}
          className="mt-2.5 rounded-full bg-sage-500 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-sage-600"
        >
          {t("context.wellnessTeaserButton")}
        </button>
      </section>
    </aside>
  );
}
