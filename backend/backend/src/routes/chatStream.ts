import { Router } from "express";
import { chatRequestSchema } from "../validators/chatSchema";
import { streamReplyTokens, classifyUrgency } from "../services/groqService";
import { chatRateLimiter } from "../middleware/rateLimiter";

export const chatStreamRouter = Router();

chatStreamRouter.post("/chat/stream", chatRateLimiter, async (req, res) => {
  const parseResult = chatRequestSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request.",
      details: parseResult.error.flatten().fieldErrors,
    });
  }

  const { message, history, language } = parseResult.data;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let fullText = "";
  let clientClosed = false;
  req.on("close", () => {
    clientClosed = true;
  });

  try {
    for await (const token of streamReplyTokens(message, history, language)) {
      if (clientClosed) break;
      fullText += token;
      res.write(`data: ${JSON.stringify({ delta: token })}\n\n`);
    }

    if (!clientClosed) {
      // Fast follow-up call to classify urgency now that the full
      // reply text is known — see groqService.ts for why this is
      // separate from the streamed text.
      const meta = await classifyUrgency(message, history, fullText, language);
      res.write(`data: ${JSON.stringify({ meta })}\n\n`);
      res.write("data: [DONE]\n\n");
    }
    res.end();
  } catch (err) {
    const errorCode = err instanceof Error ? err.message : "UNKNOWN_ERROR";
    if (!clientClosed) {
      res.write(`data: ${JSON.stringify({ error: errorCode })}\n\n`);
    }
    res.end();
  }
});
