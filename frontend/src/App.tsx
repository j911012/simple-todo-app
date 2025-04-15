import Sidebar from "@/components/Sidebar";
import TodoList from "@/components/TodoList";

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <TodoList />
    </div>
  );
}
