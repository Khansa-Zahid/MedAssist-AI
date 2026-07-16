import { useTranslation } from "react-i18next";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import type { ChatMessage, UrgencyLevel } from "../../types";

interface UrgencyTimelineProps {
  messages: ChatMessage[];
}

const URGENCY_SCORE: Record<UrgencyLevel, number> = {
  "self-care": 1,
  "see-a-doctor-soon": 2,
  "seek-urgent-care": 3,
  emergency: 4,
  unclear: 0,
};

export function UrgencyTimeline({ messages }: UrgencyTimelineProps) {
  const { t } = useTranslation();

  const dataPoints = messages
    .filter((m) => m.role === "assistant" && m.urgency && m.urgency !== "unclear")
    .map((m, index) => ({
      index: index + 1,
      value: URGENCY_SCORE[m.urgency as UrgencyLevel],
      label: t(`urgency.${m.urgency}`),
    }));

  if (dataPoints.length < 2) {
    return (
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
          {t("context.trendTitle")}
        </h3>
        <p className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-xs leading-relaxed text-ink-400 shadow-softer">
          {t("context.trendEmpty")}
        </p>
      </section>
    );
  }

  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
        {t("context.trendTitle")}
      </h3>
      <div className="rounded-2xl border border-mist-200 bg-white px-3 py-2 shadow-softer">
        <ResponsiveContainer width="100%" height={64}>
          <LineChart data={dataPoints} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
            <YAxis domain={[0, 4]} hide />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const point = payload[0].payload as { label: string };
                return (
                  <div className="rounded-xl border border-mist-200 bg-white px-2.5 py-1.5 text-xs text-ink-600 shadow-softer">
                    {point.label}
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7C93A8"
              strokeWidth={2}
              dot={{ r: 3, fill: "#7C93A8" }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
