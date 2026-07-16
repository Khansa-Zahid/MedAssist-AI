import rateLimit from "express-rate-limit";

// Free-tier protection: Groq's free tier has request/token limits per
// minute. This caps each visitor at 10 messages/minute so a single
// demo session can't burn through the whole quota.
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many messages. Please wait a moment before sending another.",
  },
});
