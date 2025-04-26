import {
  Calendar,
  Flag,
  List,
  ShoppingCart,
  Briefcase,
  Search,
  CirclePlus,
} from "lucide-react";
import { useTodoStore } from "@/lib/store";

export default function Sidebar() {
  // Zustandストアからフィルタの状態を取得
  const filterFlagged = useTodoStore((state) => state.filterFlagged);
  const setFilterFlagged = useTodoStore((state) => state.setFilterFlagged);

  // フィルタの状態をトグルする関数
  const toggleFilterFlagged = () => {
    setFilterFlagged(!filterFlagged);
  };

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-100 p-4 shadow-md">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Todo App</h1>

        <div className="relative">
          <input
            type="text"
            placeholder="検索"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer"
          >
            <Search size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <div
            className={`flex items-center gap-3 p-2 rounded-lg  cursor-pointer ${
              filterFlagged ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
            onClick={toggleFilterFlagged}
          >
            <Flag className="w-5 h-5 text-orange-500" />
            <span className="text-gray-800 font-medium">フラグ付き</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-gray-800 font-medium">今日期限</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-gray-500 text-sm font-semibold mb-2">
            マイリスト
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <List className="w-5 h-5 text-red-500" />
              <span className="text-gray-800 font-medium">リマインダー</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <ShoppingCart className="w-5 h-5 text-green-500" />
              <span className="text-gray-800 font-medium">買い物</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              <span className="text-gray-800 font-medium">仕事</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-4 left-4 flex items-center gap-3 w-[calc(100%-2rem)] text-left p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
      >
        <CirclePlus className="w-5 h-5 text-gray-500" />
        <span className="text-gray-500 font-medium">リストを追加</span>
      </button>
    </aside>
  );
}
