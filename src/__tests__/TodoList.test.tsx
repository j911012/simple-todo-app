import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TodoList from "@/components/TodoList";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("タスク追加機能", () => {
  it("入力欄に文字を入力できること", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");
    await userEvent.type(input, "テストタスク");
    expect(input).toHaveValue("テストタスク");
  });

  it("空欄でフォーム送信したとき、タスクが追加されないこと", async () => {
    render(<TodoList />);

    // 空のまま Enter を押す
    await userEvent.keyboard("{Enter}");

    // 入力フィールドの数（タスクのinput）は追加されていない
    const taskInputs = screen.queryAllByRole("textbox", { name: "" });
    // フォーム内の入力欄（新規追加のinput）以外が存在しないことを確認
    expect(taskInputs.length).toBe(1); // 1つだけ＝入力欄のみ
  });

  it("入力後に Enter でタスクが追加されること", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");

    // タスクを追加
    await userEvent.type(input, "テストタスク");
    await userEvent.keyboard("{Enter}");

    // タスクが追加されたことを確認
    const taskItem = screen.getByDisplayValue("テストタスク");
    expect(taskItem).toBeInTheDocument();
  });

  it("completed が false で初期化されていること", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");

    // タスクを追加
    await userEvent.type(input, "テストタスク");
    await userEvent.keyboard("{Enter}");

    // completed が false で初期化されていることを確認
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("複数タスクが正しく追加されること", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");

    // タスクを追加
    await userEvent.type(input, "タスク1");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(input, "タスク2");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(input, "タスク3");
    await userEvent.keyboard("{Enter}");

    // タスクが正しい順番で追加されていることを確認
    const taskItems = screen.getAllByRole("textbox");
    expect(taskItems).toHaveLength(4); // 入力フィールド + 3つのタスク
    expect(taskItems[1]).toHaveValue("タスク1");
    expect(taskItems[2]).toHaveValue("タスク2");
    expect(taskItems[3]).toHaveValue("タスク3");
  });
});

describe("チェックボックス（完了状態）", () => {
  it("チェックボックスをクリックすると completed 状態が切り替わること", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");

    // タスクを追加
    await userEvent.type(input, "テストタスク");
    await userEvent.keyboard("{Enter}");

    // チェックボックスを取得
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked(); // 初期状態は未完了

    // チェックボックスをクリックして完了状態にする
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked(); // 完了状態に切り替わる

    // 再度クリックして未完了状態に戻す
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked(); // 未完了状態に戻る
  });
});

describe("タスク編集機能", () => {
  it("テキストを変更すると editedTitle が更新されること", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");

    // タスクを追加
    await userEvent.type(input, "テストタスク");
    await userEvent.keyboard("{Enter}");

    // タスクのテキストを取得
    const taskItem = screen.getByDisplayValue("テストタスク");
    expect(taskItem).toBeInTheDocument();

    // テキストを変更
    await userEvent.clear(taskItem);
    await userEvent.type(taskItem, "変更後のタスク");

    // 変更後のテキストが表示されていることを確認
    expect(taskItem).toHaveValue("変更後のタスク");
  });

  it("フォーカスが外れたとき（blur）に編集が保存されること", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");

    // タスクを追加
    await userEvent.type(input, "タスク1");
    await userEvent.keyboard("{Enter}");

    // タスクのテキストを変更
    const taskInput = screen.getByDisplayValue("タスク1");
    await userEvent.clear(taskInput);
    await userEvent.type(taskInput, "変更後のタスク");

    // フォーカスを外す
    taskInput.blur();

    // 編集が保存されていることを確認
    expect(taskInput).toHaveValue("変更後のタスク");
  });

  it("空文字にして blur すると、元の値に戻ること", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");

    // タスクを追加
    await userEvent.type(input, "タスク1");
    await userEvent.keyboard("{Enter}");

    // タスクのテキストを空文字に変更
    const taskInput = screen.getByDisplayValue("タスク1");
    await userEvent.clear(taskInput);

    // フォーカスを外す
    await fireEvent.blur(taskInput);

    // 元の値に戻っていることを確認
    expect(taskInput).toHaveValue("タスク1");
  });
});

describe("メニュー操作（3点ボタン）", () => {
  it("3点ボタンをクリックするとメニューが表示されること", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");

    // タスクを追加
    await userEvent.type(input, "タスク1");
    await userEvent.keyboard("{Enter}");

    // 3点ボタンをクリック
    const menuButton = screen.getByRole("button");
    await userEvent.click(menuButton);

    // メニューが表示されることを確認
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
  });

  it("メニューに「Delete」が表示されること", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("新しいタスクを追加");

    // タスクを追加
    await userEvent.type(input, "タスク1");
    await userEvent.keyboard("{Enter}");

    // 3点ボタンをクリック
    const menuButton = screen.getByRole("button");
    await userEvent.click(menuButton);

    // メニュー内に「Delete」が表示されることを確認
    const deleteOption = screen.getByText("Delete");
    expect(deleteOption).toBeInTheDocument();
  });
});

describe("タスク削除機能", () => {
  it("Deleteボタンを押すと削除されること", async () => {
    const mockTodos = [{ id: "1", title: "タスク1", completed: false }];

    render(<TodoList initialTodos={mockTodos} />);

    // 3点ボタンをクリックしてメニューを表示
    const menuButton = screen.getByTestId("menu-button-1");
    await userEvent.click(menuButton);

    // Deleteボタンをクリック
    const deleteButton = screen.getByTestId("delete-button-1");
    await userEvent.click(deleteButton);

    // タスクが削除されていることを確認
    expect(screen.queryByDisplayValue("タスク1")).not.toBeInTheDocument();
  });

  it("複数タスク中、指定したタスクのみが削除されること", async () => {
    const mockTodos = [
      { id: "1", title: "タスク1", completed: false },
      { id: "2", title: "タスク2", completed: false },
      { id: "3", title: "タスク3", completed: false },
    ];
    render(<TodoList initialTodos={mockTodos} />);

    // タスク2の削除ボタンをクリック
    const menuButton = screen.getByTestId("menu-button-2");
    await userEvent.click(menuButton); // タスク2のメニューを開く
    const deleteButton = screen.getByTestId("delete-button-2");
    await userEvent.click(deleteButton);

    // タスク2が削除されていることを確認
    expect(screen.queryByDisplayValue("タスク2")).not.toBeInTheDocument();

    // 他のタスクが残っていることを確認
    expect(screen.getByDisplayValue("タスク1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("タスク3")).toBeInTheDocument();
  });
});
