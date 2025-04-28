import { useState, useEffect } from "react";
import { useTodoStore } from "@/lib/store";
import TodoItem from "@/components/TodoItem";

export default function TodoList() {
  const [inputValue, setInputValue] = useState("");
  const {
    todos,
    isLoading,
    fetchTodos,
    addTodo,
    filterFlagged,
    currentCategoryId,
    categories,
    DEFAULT_CATEGORY_ID,
  } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      await addTodo(inputValue);
      setInputValue("");
    }
  };

  // 現在のカテゴリーを取得
  const currentCategory = categories.find(
    (cat) => cat.id === currentCategoryId
  );

  // フィルタリングされたTodo一覧を取得
  const visibleTodos = todos
    .filter((todo) => {
      // カテゴリーIDが未設定の場合はデフォルトカテゴリーとして扱う
      const todoCategoryId = todo.categoryId || DEFAULT_CATEGORY_ID;
      return todoCategoryId === currentCategoryId;
    })
    .filter((todo) => !filterFlagged || todo.flagged);

  return (
    <div className="relative flex-1 h-screen ml-64">
      <div className="fixed top-0 left-64 right-0 shadow-md p-4 z-10 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">{currentCategory?.name}</h2>
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

      <div className="pt-36 px-4 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500">読み込み中...</p>
          </div>
        ) : visibleTodos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500">
              表示するタスクがありません
            </p>
          </div>
        ) : (
          <div className="max-w-[36rem] mx-auto space-y-4">
            {visibleTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
