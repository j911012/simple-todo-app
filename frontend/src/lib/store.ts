import { create } from "zustand";
import type { Todo } from "@/types/todo";

type TodoStore = {
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleCompleted: (id: string) => void;
  toggleFlagged: (id: string) => void;
  fetchTodos: () => Promise<void>;
};

// sessionStorage にデータを保存する関数
const saveTodosToSessionStorage = (todos: Todo[]) => {
  sessionStorage.setItem("todos", JSON.stringify(todos));
};

// Zustandストアの作成（Todo）
export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],

  addTodo: async (title) => {
    try {
      const res = await fetch("http://localhost:3000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title }),
      });

      if (!res.ok) throw new Error("Failed to add todo");

      const newTodo: Todo = await res.json();

      set((state) => ({ todos: [...state.todos, newTodo] }));
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  },

  updateTodo: async (updatedTodo) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/todos/${updatedTodo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        }
      );

      if (!res.ok) throw new Error("Failed to update todo");

      const updated = await res.json();

      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === updatedTodo.id ? updated : todo
        ),
      }));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  },

  deleteTodo: async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  },

  toggleCompleted: (id) =>
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodosToSessionStorage(updatedTodos);
      return { todos: updatedTodos };
    }),

  toggleFlagged: (id) =>
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, flagged: !todo.flagged } : todo
      );
      saveTodosToSessionStorage(updatedTodos);
      return { todos: updatedTodos };
    }),

  fetchTodos: async () => {
    try {
      const response = await fetch("http://localhost:3000/api/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const todos = await response.json();
      set({ todos: todos }); // APIから取得したデータでストアを更新
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  },
}));
