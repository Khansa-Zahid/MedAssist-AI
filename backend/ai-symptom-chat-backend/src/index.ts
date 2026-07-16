import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { chatRouter } from "./routes/chat";
import { chatStreamRouter } from "./routes/chatStream";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "http://localhost:5173"
).split(",");

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json({ limit: "10kb" }));

// Health check — also useful for UptimeRobot to keep the free-tier
// backend from fully spinning down.
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", chatRouter);
app.use("/api", chatStreamRouter);

// Must be registered last.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
