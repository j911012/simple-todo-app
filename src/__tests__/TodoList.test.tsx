import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoList from "@/components/TodoList";

describe("TodoList コンポーネント", () => {
  it("入力フィールドが正しく表示される", () => {
    render(<TodoList />);
    const inputElement = screen.getByPlaceholderText("新しいタスクを追加");
    expect(inputElement).toBeInTheDocument();
  });

  it("新しいタスクを追加するとリストに表示される", () => {
    render(<TodoList />);

    const inputElement = screen.getByPlaceholderText("新しいタスクを追加");
    const formElement = inputElement.closest("form");

    fireEvent.change(inputElement, { target: { value: "新しいタスク" } });
    fireEvent.submit(formElement!);

    const todoItem = screen.getByDisplayValue("新しいタスク");
    expect(todoItem).toBeInTheDocument();
  });
});
