import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/types/todo";
import { Pencil, MoreHorizontal } from "lucide-react";

type TodoItemProps = {
  todo: Todo;
};

export default function TodoItem({ todo }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-6 py-4 shadow-md bg-white">
      <Checkbox className="rounded-full size-5 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500" />
      <input
        type="text"
        value={todo.title}
        className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400"
      />
      <Pencil className="w-5 h-5 text-gray-400 hover:text-indigo-500 cursor-pointer transition-colors" />
      <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-indigo-500 cursor-pointer transition-colors" />
    </div>
  );
}
