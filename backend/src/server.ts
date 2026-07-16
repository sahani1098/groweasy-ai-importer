import dotenv from "dotenv";
dotenv.config();
console.log("Gemini Key:", process.env.GEMINI_API_KEY);

import express from "express";
import cors from "cors";

import uploadRoutes from "./routes/upload.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://groweasy-ai-importer-two.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 GrowEasy Backend Running...");
});

// Upload Route
app.use("/api/upload", uploadRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});