export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  flagged: boolean;
  categoryId: string;
};

export type TodoList = Todo[];
