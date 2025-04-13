import { useEffect, useState } from "react";
import TodoItem from "@/components/TodoItem";
import type { Todo, TodoList } from "@/types/todo";

type TodoListProps = {
  initialTodos?: Todo[]; // テストでモックデータを渡す際に使用
};

export default function TodoList({ initialTodos = [] }: TodoListProps) {
  const [todos, setTodos] = useState<TodoList>(initialTodos);
  const [inputValue, setInputValue] = useState("");

  console.log(todos);

  // sessionStorageに保存する関数
  const saveToSessionStorage = (todos: Todo[]) => {
    // TodosをJSON形式で sessionStorage に保存
    sessionStorage.setItem("todos", JSON.stringify(todos));
  };

  useEffect(() => {
    // 初回レンダリング時に sessionStorage から Todos を取得
    const storedTodos = sessionStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []); // 初回レンダリング時のみ実行

  // 新しいタスクを追加する関数
  const addTodo = () => {
    if (inputValue.trim() === "") return; // 空の入力は無視

    const newTodo = {
      id: crypto.randomUUID(),
      title: inputValue,
      completed: false,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos); // ステートを更新
    saveToSessionStorage(updatedTodos); // sessionStorage に保存
    setInputValue(""); // 入力フィールドをクリア
  };

  // タスクを削除する関数
  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveToSessionStorage(updatedTodos);
  };

  // タスクを更新する関数
  const updateTodo = (updatedTodo: Todo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
    saveToSessionStorage(updatedTodos);
  };

  // フォームの送信を処理する関数
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルトの動作を防ぐ
    addTodo();
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
              onChange={(e) => setInputValue(e.target.value)} // 入力値を更新
            />
          </div>
        </form>
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
  );
}
