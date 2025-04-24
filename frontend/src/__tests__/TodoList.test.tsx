import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import TodoList from "@/components/TodoList";

const updateTodo = vi.fn();
const deleteTodo = vi.fn();
const toggleCompleted = vi.fn();
const toggleFlagged = vi.fn();

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
        updateTodo: updateTodo,
        deleteTodo: deleteTodo,
        toggleCompleted: toggleCompleted,
        toggleFlagged: toggleFlagged,
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

  it("タスクの完了状態を切り替えられる", async () => {
    render(<TodoList />);
    const checkbox = screen.getByTestId("checkbox-1");
    await userEvent.click(checkbox);
    expect(toggleCompleted).toHaveBeenCalledWith("1");
  });

  it("タスクのタイトルを編集できる", async () => {
    render(<TodoList />);
    const taskInput = screen.getByDisplayValue("テストタスク");
    await userEvent.clear(taskInput);
    await userEvent.type(taskInput, "編集されたタスク");

    // フォーカス外して blur を強制発火（Enter だと submit 通らないことがある）
    // await userEvent.keyboard("{enter}");
    await userEvent.tab();

    console.log("updateTodo", updateTodo.mock.calls);

    // タスクの更新を確認
    expect(updateTodo).toHaveBeenCalledWith({
      id: "1",
      title: "編集されたタスク",
      completed: false,
      flagged: false,
    });

    // 編集後のタスクを確認
    const updatedTaskInput = await screen.findByDisplayValue(
      "編集されたタスク"
    );
    expect(updatedTaskInput).toHaveValue("編集されたタスク");
  });

  it("タスクを削除できる", async () => {
    render(<TodoList />);
    const menuButton = screen.getByTestId("menu-button-1");
    await userEvent.click(menuButton);

    const deleteButton = await screen.findByTestId("delete-button-1");
    await userEvent.click(deleteButton);
    expect(deleteTodo).toHaveBeenCalledWith("1");
    expect(screen.queryByText("テストタスク")).not.toBeInTheDocument();
  });

  it("タスクのフラグを切り替えられる", async () => {
    render(<TodoList />);
    const menuButton = screen.getByTestId("menu-button-1");
    await userEvent.click(menuButton);

    const flagButton = await screen.findByTestId("flag-button-1");
    await userEvent.click(flagButton);
    expect(toggleFlagged).toHaveBeenCalledWith("1");
  });
});
