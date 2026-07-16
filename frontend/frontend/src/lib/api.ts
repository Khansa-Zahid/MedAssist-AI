import type { ChatApiResponse, ChatMessage, SupportedLanguage, UrgencyLevel } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  language: SupportedLanguage
): Promise<ChatApiResponse> {
  const trimmedHistory = history.slice(-10).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: trimmedHistory, language }),
    });
  } catch {
    throw new ApiError("NETWORK_ERROR");
  }

  if (response.status === 429) {
    throw new ApiError("RATE_LIMITED", 429);
  }

  if (!response.ok) {
    throw new ApiError("REQUEST_FAILED", response.status);
  }

  return (await response.json()) as ChatApiResponse;
}

interface StreamMeta {
  urgency: UrgencyLevel;
  disclaimer: string;
}

/**
 * Streams the AI's reply token-by-token from /api/chat/stream. Uses
 * fetch + a ReadableStream reader rather than the native EventSource,
 * since EventSource can't send a POST body — this is the standard
 * pattern for POST-based SSE.
 */
export async function streamChatMessage(
  message: string,
  history: ChatMessage[],
  language: SupportedLanguage,
  onToken: (token: string) => void,
  onMeta: (meta: StreamMeta) => void
): Promise<void> {
  const trimmedHistory = history.slice(-10).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: trimmedHistory, language }),
    });
  } catch {
    throw new ApiError("NETWORK_ERROR");
  }

  if (response.status === 429) {
    throw new ApiError("RATE_LIMITED", 429);
  }

  if (!response.ok || !response.body) {
    throw new ApiError("REQUEST_FAILED", response.status);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const rawEvent of events) {
      const line = rawEvent.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;

      let parsed: { delta?: string; meta?: StreamMeta; error?: string };
      try {
        parsed = JSON.parse(payload);
      } catch {
        continue;
      }

      if (parsed.error) {
        throw new ApiError(parsed.error);
      }
      if (parsed.delta) {
        onToken(parsed.delta);
      }
      if (parsed.meta) {
        onMeta(parsed.meta);
      }
    }
  }
}

