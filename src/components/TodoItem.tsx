import { useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/types/todo";
import { MoreHorizontal, Flag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

type TodoItemProps = {
  todo: Todo;
  updateTodo: (updatedTodo: Todo) => void;
  deleteTodo: (id: string) => void;
};

export default function TodoItem({
  todo,
  updateTodo,
  deleteTodo,
}: TodoItemProps) {
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

  // 完了状態を切り替える関数
  const toggleCompleted = () => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(updatedTodo);
  };

  // フラグ状態を切り替える関数
  const toggleFlagged = () => {
    const updatedTodo = {
      ...todo,
      flagged: !todo.flagged,
    };

    updateTodo(updatedTodo);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center gap-3 border border-gray-300 rounded-xl pl-6 pr-8 py-4 shadow-md bg-white"
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={toggleCompleted}
        className="rounded-full size-5 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
      />
      <input
        ref={inputRef} // 入力フィールドに参照を設定
        type="text"
        value={editedTitle}
        className={cn(
          "flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400",
          todo.completed && "line-through text-gray-400" // 完了状態のスタイル
        )}
        onChange={(e) => setEditedTitle(e.target.value)}
        onBlur={handleBlur}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            data-testid={`menu-button-${todo.id}`}
            className="w-5 h-5 text-gray-400 hover:text-indigo-500 cursor-pointer transition-colors"
          >
            <MoreHorizontal />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex items-center gap-2 bg-white shadow-md rounded-md p-2 z-10">
          <DropdownMenuItem
            onClick={() => deleteTodo(todo.id)}
            data-testid={`delete-button-${todo.id}`}
            aria-label="delete"
            className="text-gray-400 cursor-pointer hover:text-red-500 flex items-center justify-center"
          >
            <Trash2 />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={toggleFlagged}
            data-testid={`flag-button-${todo.id}`}
            aria-label="flag"
            className="text-gray-400 cursor-pointer hover:text-orange-500 flex items-center justify-center"
          >
            <Flag />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {todo.flagged && (
        <Flag
          className="absolute top-1/2 right-2 transform -translate-y-1/2 w-4 h-4 text-orange-500"
          role="icon"
          aria-label="flag"
        /> // フラグが立っている場合に旗アイコンを表示
      )}
    </form>
  );
}
