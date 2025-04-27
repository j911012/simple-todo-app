import { Router, RequestHandler } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// カテゴリー一覧を取得
const getCategories: RequestHandler = async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: { todos: true }, // 関連するTodoも取得
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// 新しいカテゴリーを作成
const createCategory: RequestHandler = async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    res.status(400).json({ error: "Name is required" });
  }

  try {
    const newCategory = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

router.get("/", getCategories);
router.post("/", createCategory);

export default router;
