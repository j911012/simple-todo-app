import { useState, useEffect } from "react";
import { useTodoStore } from "@/lib/store";
import TodoItem from "@/components/TodoItem";

export default function TodoList() {
  // Zustandストアから todos, addTodo, fetchTodos を取得
  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const [inputValue, setInputValue] = useState("");

  // 初期レンダリング時に Todo 一覧を取得
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // フォームの送信を処理する関数
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルトの動作を防ぐ
    if (inputValue.trim() === "") return; // 空の入力は無視

    const newTodo = {
      id: crypto.randomUUID(),
      title: inputValue,
      completed: false,
      flagged: false,
    };

    addTodo(newTodo);
    setInputValue(""); // 入力フィールドをクリア
  };

  return (
    <div className="relative flex-1 h-screen ml-64">
      <div className="fixed top-0 left-64 w-[calc(100%-16rem)] shadow-md p-4 z-10 bg-gray-100">
        <form onSubmit={handleSubmit} className="max-w-[36rem] mx-auto">
          <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 bg-white">
            <input
              type="text"
              value={inputValue}
              placeholder="新しいタスクを追加"
              className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400"
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="pt-24 h-[calc(100vh-80px)] overflow-y-auto p-4">
        <div className="max-w-[36rem] mx-auto space-y-4">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      </div>
    </div>
  );
}
