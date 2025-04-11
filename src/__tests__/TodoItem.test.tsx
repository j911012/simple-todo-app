import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoItem from "@/components/TodoItem";
import { vi } from "vitest";

describe("TodoItem コンポーネント", () => {
  it("タスクのタイトルが正しく表示される", () => {
    const mockTodo = { id: "1", title: "テストタスク", completed: false };
    const mockUpdateTodo = vi.fn();

    render(<TodoItem todo={mockTodo} updateTodo={mockUpdateTodo} />);

    const inputElement = screen.getByDisplayValue("テストタスク");
    expect(inputElement).toBeInTheDocument();
  });

  it("タイトルを変更してフォーカスを外すと updateTodo が呼び出される", () => {
    const mockTodo = { id: "1", title: "テストタスク", completed: false };
    const mockUpdateTodo = vi.fn();

    render(<TodoItem todo={mockTodo} updateTodo={mockUpdateTodo} />);

    const inputElement = screen.getByDisplayValue("テストタスク");
    fireEvent.change(inputElement, { target: { value: "更新されたタスク" } });
    fireEvent.blur(inputElement);

    expect(mockUpdateTodo).toHaveBeenCalledWith({
      ...mockTodo,
      title: "更新されたタスク",
    });
  });
});
