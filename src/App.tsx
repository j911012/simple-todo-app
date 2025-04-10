import Header from "@/components/Header";
import TodoList from "@/components/TodoList";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <TodoList />
    </div>
  );
}
