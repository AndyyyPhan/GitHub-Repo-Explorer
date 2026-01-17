import express from "express";
import cors from "cors";
import "dotenv/config";
import { meRouter } from "./routes/me.js";
import { authRouter } from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);

app.get("/", (req, res) => res.status(200).send("OK"));

if (process.env.VERCEL !== "1") {
  app
    .listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    })
    .on("error", (err) => {
      console.error("Failed to start server:", err);
    });
}

export default app;
