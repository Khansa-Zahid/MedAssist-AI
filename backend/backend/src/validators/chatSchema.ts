import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long (max 1000 characters)"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(1000),
      })
    )
    .max(20, "Conversation history too long")
    .optional()
    .default([]),
  language: z.enum(["en", "ar", "ur"]).optional().default("en"),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
