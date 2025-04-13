import { useState } from "react";
import TodoItem from "@/components/TodoItem";
import type { Todo, TodoList } from "@/types/todo";

type TodoListProps = {
  initialTodos?: Todo[]; // テストでモックデータを渡す際に使用
};

export default function TodoList({ initialTodos = [] }: TodoListProps) {
  const [todos, setTodos] = useState<TodoList>(initialTodos);
  const [inputValue, setInputValue] = useState("");

  console.log(todos);

  // 新しいタスクを追加する関数
  const addTodo = () => {
    if (inputValue.trim() === "") return; // 空の入力は無視

    const newTodo = {
      id: crypto.randomUUID(),
      title: inputValue,
      completed: false,
      flagged: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]); // 新しいタスクを追加
    setInputValue(""); // 入力フィールドをクリア
  };

  // タスクを削除する関数
  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
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
    <div className="relative h-screen ml-64">
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
            <TodoItem
              key={todo.id}
              todo={todo}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
