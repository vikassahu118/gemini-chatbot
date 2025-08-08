import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cors from "cors";
import detect from "detect-port"; // 📦 check free ports

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// ✅ Start server on a free port
(async () => {
  const defaultPort = process.env.PORT || 5001;
  const freePort = await detect(defaultPort);

  if (freePort !== defaultPort) {
    console.warn(
      `⚠️ Port ${defaultPort} is in use. Switching to available port ${freePort}...`
    );
  }

  app.listen(freePort, () => {
    console.log(`✅ Server is working on port ${freePort}`);
    connectDb();
  });
})();
