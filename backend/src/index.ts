// src/index.ts
import express from "express";
import { prisma } from "./lib/prisma"; // さっき作ったやつ

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express + Prisma!");
});

// DB接続してテストでタスクを1件作るルート
app.post("/test", async (req, res) => {
  try {
    const todo = await prisma.todo.create({
      data: {
        title: "Prismaから作成されたタスク",
        completed: false,
        flagged: false,
      },
    });

    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
