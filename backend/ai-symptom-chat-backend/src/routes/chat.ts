import { Router } from "express";
import { chatRequestSchema } from "../validators/chatSchema";
import { getAIResponse } from "../services/groqService";
import { chatRateLimiter } from "../middleware/rateLimiter";

export const chatRouter = Router();

chatRouter.post("/chat", chatRateLimiter, async (req, res, next) => {
  const parseResult = chatRequestSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request.",
      details: parseResult.error.flatten().fieldErrors,
    });
  }

  const { message, history, language } = parseResult.data;

  try {
    const aiResponse = await getAIResponse(message, history, language);
    return res.status(200).json(aiResponse);
  } catch (err) {
    next(err);
  }
});
