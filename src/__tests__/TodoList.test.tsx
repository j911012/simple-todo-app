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
it("タスクを削除するとリストから消える", () => {
  render(<TodoList />);

  const inputElement = screen.getByPlaceholderText("新しいタスクを追加");
  const formElement = inputElement.closest("form");

  // タスクを追加
  fireEvent.change(inputElement, { target: { value: "削除するタスク" } });
  fireEvent.submit(formElement!);

  // タスクがリストに表示されていることを確認
  const todoItem = screen.getByDisplayValue("削除するタスク");
  expect(todoItem).toBeInTheDocument();

  // 削除ボタンをクリック
  const deleteButton = screen.getByText("Delete");
  fireEvent.click(deleteButton);

  // タスクがリストから消えていることを確認
  expect(screen.queryByDisplayValue("削除するタスク")).not.toBeInTheDocument();
});
