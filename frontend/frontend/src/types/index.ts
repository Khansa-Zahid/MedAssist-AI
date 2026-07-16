export type SupportedLanguage = "en" | "ar" | "ur";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  urgency?: UrgencyLevel;
  disclaimer?: string;
  createdAt: number;
}

export type UrgencyLevel =
  | "self-care"
  | "see-a-doctor-soon"
  | "seek-urgent-care"
  | "emergency"
  | "unclear";

export interface ChatApiResponse {
  reply: string;
  urgency: UrgencyLevel;
  disclaimer: string;
}

export type EmergencyRegion = "uk" | "uae";

export interface UserProfile {
  name: string;
  language: SupportedLanguage;
  emergencyRegion: EmergencyRegion;
  hasAcceptedDisclaimer: boolean;
  createdAt: number;
}
