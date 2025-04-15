import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// JSONを扱えるようにするミドルウェア
app.use(express.json());

// 仮のルート
app.get("/", (req, res) => {
  res.send("Hello from Express + TypeScript!");
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
