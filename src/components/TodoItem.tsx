import { useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/types/todo";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type TodoItemProps = {
  todo: Todo;
  updateTodo: (updatedTodo: Todo) => void;
};

export default function TodoItem({ todo, updateTodo }: TodoItemProps) {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null); // 入力フィールドへの参照を作成

  // タスクを保存する関数
  const handleSave = () => {
    if (editedTitle.trim() === "") {
      setEditedTitle(todo.title); // 空文字の場合、元の値に戻す
      return;
    }

    const updatedTodo = {
      ...todo,
      title: editedTitle,
    };

    updateTodo(updatedTodo); // タスクを更新
  };

  // フォーム送信時の処理（Enterキーで保存）
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルトの動作を防ぐ
    handleSave(); // タスクを保存

    // フォーカスを外す
    inputRef.current?.blur();
  };

  // フォーカスが外れた時の処理（Blurイベント）
  const handleBlur = () => {
    handleSave(); // タスクを保存
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border border-gray-300 rounded-xl px-6 py-4 shadow-md bg-white"
    >
      <Checkbox className="rounded-full size-5 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500" />
      <input
        ref={inputRef} // 入力フィールドに参照を設定
        type="text"
        value={editedTitle}
        className={cn(
          "flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400"
        )}
        onChange={(e) => setEditedTitle(e.target.value)}
        onBlur={handleBlur}
      />
      <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-indigo-500 cursor-pointer transition-colors" />
    </form>
  );
}
