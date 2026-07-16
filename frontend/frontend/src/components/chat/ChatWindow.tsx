import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { ChatMessage } from "../../types";
import type { ChatErrorKind } from "../../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ErrorBanner } from "./ErrorBanner";
import { SuggestionChips } from "./SuggestionChips";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: ChatErrorKind;
  onRetry: () => void;
  onSuggestionSelect: (text: string) => void;
  greeting: string;
  emergencyNumber?: string;
}

export function ChatWindow({
  messages,
  isLoading,
  error,
  onRetry,
  onSuggestionSelect,
  greeting,
  emergencyNumber,
}: ChatWindowProps) {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, error]);

  const lastMessage = messages[messages.length - 1];
  // While waiting on the very first token, show the "..." dots. Once
  // streaming starts (content is non-empty), the bubble itself shows
  // a blinking cursor instead — see MessageBubble.
  const showTypingDots =
    isLoading && lastMessage?.role === "assistant" && lastMessage.content === "";

  return (
    <div className="chat-scroll flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
      <div className="flex flex-col items-start gap-3">
        <div className="max-w-[85%] rounded-2xl rounded-ss-sm border border-mist-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-ink-900 shadow-softer sm:text-base">
          {greeting}
        </div>
        {messages.length === 0 && <SuggestionChips onSelect={onSuggestionSelect} />}
      </div>

      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={isLoading && index === messages.length - 1 && message.role === "assistant"}
          emergencyNumber={emergencyNumber}
        />
      ))}

      {showTypingDots && <TypingIndicator />}
      {error && <ErrorBanner kind={error} onRetry={onRetry} />}

      <div ref={bottomRef} />

      {messages.length === 0 && !isLoading && (
        <p className="pt-4 text-center text-xs text-ink-400">{t("footer.poweredBy")}</p>
      )}
    </div>
  );
}
