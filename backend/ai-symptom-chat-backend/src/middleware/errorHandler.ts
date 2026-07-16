import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[ERROR]", err.message);

  if (err.message === "MISSING_API_KEY") {
    return res.status(500).json({
      error: "Server is misconfigured. Please try again later.",
    });
  }

  if (err.message === "AI_TIMEOUT") {
    return res.status(504).json({
      error: "The AI service took too long to respond. Please try again.",
    });
  }

  if (
    err.message === "AI_NETWORK_ERROR" ||
    err.message.startsWith("AI_API_ERROR")
  ) {
    return res.status(502).json({
      error: "The AI service is currently unavailable. Please try again shortly.",
    });
  }

  if (err.message === "AI_MALFORMED_JSON" || err.message === "AI_EMPTY_RESPONSE") {
    return res.status(502).json({
      error: "The AI service returned an unexpected response. Please try again.",
    });
  }

  return res.status(500).json({
    error: "Something went wrong on our end. Please try again.",
  });
}
