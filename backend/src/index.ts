import express from "express";
import { config } from "dotenv";
import cors from "cors";
import todoRoutes from "./routes/todos";

config(); // .env 読み込み

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

app.get("/", (_req, res) => {
  res.send("Hello from Express + Prisma!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
