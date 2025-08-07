import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cors from "cors";

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running...");
  });



import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is working on port ${PORT}`);
  connectDb();
});