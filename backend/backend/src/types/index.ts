export type ChatRole = "user" | "assistant";

export type SupportedLanguage = "en" | "ar" | "ur";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export type UrgencyLevel =
  | "self-care"
  | "see-a-doctor-soon"
  | "seek-urgent-care"
  | "emergency"
  | "unclear";

export interface GroqStructuredResponse {
  reply: string;
  urgency: UrgencyLevel;
  disclaimer: string;
}
