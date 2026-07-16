import type { ChatMessage } from "../../types";
import { TriageCard } from "./TriageCard";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  emergencyNumber?: string;
}

export function MessageBubble({ message, isStreaming, emergencyNumber }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] animate-fade-in-up rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:text-base ${
          isUser
            ? "rounded-ee-sm bg-dusk-400 text-white"
            : "rounded-ss-sm border border-mist-200 bg-white text-ink-900 shadow-softer"
        }`}
      >
        {message.content}
        {isStreaming && (
          <span
            className="ms-0.5 inline-block h-4 w-[2px] animate-pulse bg-ink-400 align-middle"
            aria-hidden="true"
          />
        )}
      </div>
      {!isUser && message.urgency && message.disclaimer && (
        <TriageCard
          urgency={message.urgency}
          disclaimer={message.disclaimer}
          emergencyNumber={emergencyNumber}
        />
      )}
    </div>
  );
}
