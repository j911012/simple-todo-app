import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// GET /api/todos - 全てのタスクを取得
router.get("/", async (_req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// POST /api/todos - 新しいタスクを追加
router.post("/", async (req: Request, res: Response) => {
  const { title, categoryId } = req.body;

  if (!title?.trim()) {
    res.status(400).json({ error: "Title is required" });
  }

  try {
    const newTodo = await prisma.todo.create({
      data: {
        title,
        categoryId,
      },
    });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// PUT /api/todos/:id - 既存のタスクを更新
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed, flagged } = req.body;

  try {
    const updated = await prisma.todo.update({
      where: { id },
      data: { title, completed, flagged },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// DELETE /api/todos/:id - タスクを削除
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.todo.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default router;
