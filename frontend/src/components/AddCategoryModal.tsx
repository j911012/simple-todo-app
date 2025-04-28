import { useState } from "react";
import { useTodoStore } from "@/lib/store";

type AddCategoryModalProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onClose: () => void;
};

export default function AddCategoryModal({
  dialogRef,
  onClose,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const addCategory = useTodoStore((state) => state.addCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await addCategory(name);
      setName("");
      dialogRef.current?.close();
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="p-0 bg-transparent backdrop:bg-black/50 m-auto"
      onClose={handleClose}
    >
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4">新しいリスト</h2>
        <form method="dialog" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="リスト名"
            className="w-full px-3 py-2 border rounded"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
