import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import TodoList from "@/components/TodoList";

// Zustand ストアの手動モック
vi.mock("@/lib/store", () => {
  const todos = [
    {
      id: "1",
      title: "テストタスク",
      completed: false,
      flagged: false,
    },
  ];

  return {
    useTodoStore: (selector: any) =>
      selector({
        todos,
        fetchTodos: vi.fn(),
        addTodo: vi.fn((title: string) => {
          todos.push({
            id: String(todos.length + 1),
            title,
            completed: false,
            flagged: false,
          });
        }),
        updateTodo: vi.fn(),
        deleteTodo: vi.fn(),
        toggleCompleted: vi.fn(),
        toggleFlagged: vi.fn(),
      }),
  };
});

describe("TodoList 基本機能", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("入力欄に文字を入力できる", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");
    await userEvent.type(input, "新しいタスク");
    expect(input).toHaveValue("新しいタスク");
  });

  it("タスクを追加できる", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");
    await userEvent.type(input, "新しいタスク");
    await userEvent.keyboard("{enter}");
    // 追加された task を確認
    const taskInput = await screen.findByDisplayValue("新しいタスク");
    expect(taskInput).toBeInTheDocument();
  });
});
