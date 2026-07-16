import { buildSystemPrompt, buildStreamingSystemPrompt, buildClassifierPrompt } from "../prompts/systemPrompt";
import type {
  ChatMessage,
  GroqStructuredResponse,
  SupportedLanguage,
  UrgencyLevel,
} from "../types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Free-tier model on Groq. Check https://console.groq.com/docs/models
// for the current list of free models — Groq occasionally rotates these.
const MODEL = "llama-3.3-70b-versatile";

const REQUEST_TIMEOUT_MS = 15000;
const MAX_HISTORY_MESSAGES = 10;

export async function getAIResponse(
  message: string,
  history: ChatMessage[],
  language: SupportedLanguage = "en"
): Promise<GroqStructuredResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const messages = [
    { role: "system", content: buildSystemPrompt(language) },
    ...history.slice(-MAX_HISTORY_MESSAGES),
    { role: "user", content: message },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 400,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("AI_TIMEOUT");
    }
    throw new Error("AI_NETWORK_ERROR");
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`AI_API_ERROR: ${response.status} ${errBody}`);
  }

  const data = await response.json();
  const rawContent: string | undefined = data?.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error("AI_EMPTY_RESPONSE");
  }

  let parsed: GroqStructuredResponse;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new Error("AI_MALFORMED_JSON");
  }

  // Safety net: enforce the disclaimer and urgency fields even if the
  // model forgets to include them. This is deliberate defense-in-depth —
  // the UI should never render a response missing a disclaimer.
  if (!parsed.disclaimer) {
    parsed.disclaimer =
      "This is not a medical diagnosis. Please consult a licensed doctor for any health concerns.";
  }
  if (!parsed.urgency) {
    parsed.urgency = "unclear";
  }

  return parsed;
}

/**
 * Streams the AI's conversational reply token-by-token via Groq's
 * `stream: true` mode. Deliberately NOT using response_format: json_object
 * here — structured JSON can't be meaningfully parsed until it's fully
 * received, which would defeat the point of streaming. Urgency/disclaimer
 * are classified separately once the full text is known (see
 * classifyUrgency below).
 */
export async function* streamReplyTokens(
  message: string,
  history: ChatMessage[],
  language: SupportedLanguage = "en"
): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const messages = [
    { role: "system", content: buildStreamingSystemPrompt(language) },
    ...history.slice(-MAX_HISTORY_MESSAGES),
    { role: "user", content: message },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        temperature: 0.4,
        max_tokens: 400,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("AI_TIMEOUT");
    }
    throw new Error("AI_NETWORK_ERROR");
  }

  if (!response.ok || !response.body) {
    clearTimeout(timeoutId);
    const errBody = await response.text().catch(() => "");
    throw new Error(`AI_API_ERROR: ${response.status} ${errBody}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Groq streams standard SSE lines: "data: {json}\n\n", ending
      // with a literal "data: [DONE]" line.
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") return;

        try {
          const parsed = JSON.parse(payload);
          const token = parsed?.choices?.[0]?.delta?.content;
          if (token) yield token as string;
        } catch {
          // Malformed chunk boundary — skip rather than aborting the
          // whole stream over one bad line.
        }
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Classifies urgency + generates a disclaimer for a completed reply.
 * Runs as a fast, non-streamed, low-token follow-up call after the
 * streamed text finishes — keeps the structured triage data the rest
 * of the app depends on, while still letting the reply text itself
 * stream in real time.
 */
export async function classifyUrgency(
  message: string,
  history: ChatMessage[],
  assistantReply: string,
  language: SupportedLanguage = "en"
): Promise<{ urgency: UrgencyLevel; disclaimer: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const conversationSnippet = [
    ...history.slice(-6),
    { role: "user", content: message },
    { role: "assistant", content: assistantReply },
  ]
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildClassifierPrompt(language) },
          { role: "user", content: conversationSnippet },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 150,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("AI_TIMEOUT");
    }
    throw new Error("AI_NETWORK_ERROR");
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`AI_API_ERROR: ${response.status} ${errBody}`);
  }

  const data = await response.json();
  const rawContent: string | undefined = data?.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("AI_EMPTY_RESPONSE");
  }

  let parsed: { urgency?: UrgencyLevel; disclaimer?: string };
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new Error("AI_MALFORMED_JSON");
  }

  return {
    urgency: parsed.urgency ?? "unclear",
    disclaimer:
      parsed.disclaimer ??
      "This is not a medical diagnosis. Please consult a licensed doctor for any health concerns.",
  };
}
