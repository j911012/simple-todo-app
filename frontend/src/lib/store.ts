import { create } from "zustand";
import type { Todo } from "@/types/todo";
import api from "@/lib/api";

type TodoStore = {
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleCompleted: (id: string) => void;
  toggleFlagged: (id: string) => void;
  fetchTodos: () => Promise<void>;
  filterFlagged: boolean;
  setFilterFlagged: (flag: boolean) => void;
  isLoading: boolean;
};

// Zustandストアの作成（Todo）
export const useTodoStore = create<TodoStore>((set, get) => ({
  // set: 状態を更新するための関数
  // get: 現在の状態を取得するための関数
  todos: [],
  isLoading: false, // ローディング状態を管理するためのフラグ
  filterFlagged: false,

  setFilterFlagged: (flag: boolean) => set({ filterFlagged: flag }), // フィルタの状態を更新

  addTodo: async (title) => {
    try {
      const res = await api.post<Todo>("/todos", {
        title: title,
      });
      const newTodo = res.data;
      set((state) => ({ todos: [newTodo, ...state.todos] }));
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  },

  updateTodo: async (updatedTodo) => {
    try {
      const res = await api.put<Todo>(`/todos/${updatedTodo.id}`, updatedTodo);
      const updated = res.data;
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
      await api.delete(`/todos/${id}`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  },

  toggleCompleted: async (id) => {
    const todo = get().todos.find((todo) => todo.id === id); // todosから該当のtodoを取得

    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };
    await get().updateTodo(updatedTodo); // APIを呼び出して更新
  },

  toggleFlagged: async (id) => {
    const todo = get().todos.find((todo) => todo.id === id); // todosから該当のtodoを取得

    if (!todo) return;

    const updatedTodo = { ...todo, flagged: !todo.flagged };
    await get().updateTodo(updatedTodo); // APIを呼び出して更新
  },

  fetchTodos: async () => {
    set({ isLoading: true }); // ローディング状態を開始
    try {
      const res = await api.get<Todo[]>("/todos");
      const todos = res.data;
      set({ todos: todos }); // APIから取得したデータでストアを更新
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      set({ isLoading: false }); // ローディング状態を終了
    }
  },
}));
