import { create } from "zustand";
import type { Todo } from "@/types/todo";

type TodoStore = {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  updateTodo: (updatedTodo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleCompleted: (id: string) => void;
  toggleFlagged: (id: string) => void;
  fetchTodos: () => Promise<void>;
};

// sessionStorage からデータを読み込む関数
const loadTodosFromSessionStorage = (): Todo[] => {
  const storedTodos = sessionStorage.getItem("todos");
  return storedTodos ? JSON.parse(storedTodos) : [];
};

// sessionStorage にデータを保存する関数
const saveTodosToSessionStorage = (todos: Todo[]) => {
  sessionStorage.setItem("todos", JSON.stringify(todos));
};

// Zustandストアの作成（Todo）
export const useTodoStore = create<TodoStore>((set) => ({
  todos: loadTodosFromSessionStorage(),

  addTodo: (todo) =>
    set((state) => {
      const updatedTodos = [...state.todos, todo];
      saveTodosToSessionStorage(updatedTodos);
      return { todos: updatedTodos };
    }),

  updateTodo: (updatedTodo) =>
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      saveTodosToSessionStorage(updatedTodos);
      return { todos: updatedTodos };
    }),

  deleteTodo: (id) =>
    set((state) => {
      const updatedTodos = state.todos.filter((todo) => todo.id !== id);
      saveTodosToSessionStorage(updatedTodos);
      return { todos: updatedTodos };
    }),

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
