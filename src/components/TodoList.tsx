import { useState } from "react";
import TodoItem from "@/components/TodoItem";
import type { Todo, TodoList } from "@/types/todo";

export default function TodoList() {
  const [todos, setTodos] = useState<TodoList>([]);
  const [inputValue, setInputValue] = useState("");

  console.log(todos);

  // 新しいタスクを追加する関数
  const addTodo = () => {
    if (inputValue.trim() === "") return; // 空の入力は無視

    const newTodo = {
      id: crypto.randomUUID(),
      title: inputValue,
      completed: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]); // 新しいタスクを追加
    setInputValue(""); // 入力フィールドをクリア
  };

  // タスクを更新する関数
  const updateTodo = (updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  // フォームの送信を処理する関数
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルトの動作を防ぐ
    addTodo();
  };

  return (
    <section className="p-4">
      <div className="space-y-4 max-w-xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-6 py-4 shadow-md bg-white">
            <input
              type="text"
              value={inputValue}
              placeholder="新しいタスクを追加"
              className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400"
              onChange={(e) => setInputValue(e.target.value)} // 入力値を更新
            />
          </div>
        </form>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} updateTodo={updateTodo} />
        ))}
      </div>
    </section>
  );
}
