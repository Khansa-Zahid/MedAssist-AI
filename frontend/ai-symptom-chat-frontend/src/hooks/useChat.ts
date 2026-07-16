import { useCallback, useEffect, useState } from "react";
import type { ChatMessage, SupportedLanguage } from "../types";
import { streamChatMessage, ApiError } from "../lib/api";
import { clearHistory, loadHistory, saveHistory } from "../lib/storage";

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type ChatErrorKind = "network" | "rate_limited" | "generic" | null;

export function useChat(language: SupportedLanguage) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatErrorKind>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      setPendingMessage(trimmed);

      const userMessage: ChatMessage = {
        id: makeId(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };
      const assistantId = makeId();
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
      };

      // Snapshot of history BEFORE this exchange — this is what gets
      // sent to the API as conversation context.
      const historySnapshot = messages;
      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsLoading(true);

      try {
        await streamChatMessage(
          trimmed,
          historySnapshot,
          language,
          (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + token } : m
              )
            );
          },
          (meta) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, urgency: meta.urgency, disclaimer: meta.disclaimer }
                  : m
              )
            );
          }
        );
        setPendingMessage(null);
      } catch (err) {
        // Remove the empty assistant placeholder on failure so we
        // don't leave a blank bubble behind.
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));

        if (err instanceof ApiError && err.status === 429) {
          setError("rate_limited");
        } else if (err instanceof ApiError && err.message === "NETWORK_ERROR") {
          setError("network");
        } else {
          setError("generic");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, language]
  );

  const retry = useCallback(() => {
    if (!pendingMessage) return;
    // Remove the last user message so sendMessage doesn't duplicate it,
    // then resend.
    setMessages((prev) => prev.slice(0, -1));
    void sendMessage(pendingMessage);
  }, [pendingMessage, sendMessage]);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    clearHistory();
    setError(null);
    setPendingMessage(null);
  }, []);

  return { messages, isLoading, error, sendMessage, retry, startNewConversation };
}
