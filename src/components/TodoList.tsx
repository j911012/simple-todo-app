import TodoItem from "@/components/TodoItem";

export default function TodoList() {
  return (
    <section className="p-4">
      <div className="space-y-4 max-w-xl mx-auto">
        <TodoItem />
      </div>
    </section>
  );
}
