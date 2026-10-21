import { useEffect, useRef, useState } from "react";

export default function DeleteCategoryDialog({
  category,
  transactions,
  categories,
  onDelete,
  onClose,
  notify,
}) {
  const dialog = useRef(null);
  const [replacement, setReplacement] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const count = transactions.filter(
    (row) => row.category_id === category.id,
  ).length;
  const alternatives = categories.filter(
    (row) => row.id !== category.id && row.type === category.type,
  );
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  async function confirm() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await onDelete(category.id, replacement ? Number(replacement) : null);
      notify("Category removed");
      onClose();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      aria-labelledby="delete-category-title"
      aria-describedby="delete-category-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className="m-auto w-[min(460px,calc(100vw-32px))] rounded-2xl border border-[#e2e8e2] bg-white p-6 text-[#183247] shadow-2xl backdrop:bg-[#071b2a88] backdrop:backdrop-blur-[3px]"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="delete-category-title" className="text-[22px]">
          Remove category?
        </h2>
        <button
          aria-label="Close category confirmation"
          disabled={busy}
          onClick={onClose}
          className="border-0 px-2 py-0 text-2xl"
        >
          ×
        </button>
      </div>
      <p id="delete-category-description" className="text-xs">
        Remove “{category.name}” from your categories.{" "}
        {count
          ? `${count} transaction${count === 1 ? "" : "s"} across all months use this category. Move them to another ${category.type} category below.`
          : "No transactions use this category."}
      </p>
      {count > 0 && (
        <label className="mt-5 grid gap-2 text-xs text-[#64796b]">
          Move existing transactions to
          <select
            aria-label="Replacement category"
            value={replacement}
            disabled={busy}
            onChange={(event) => setReplacement(event.target.value)}
          >
            <option value="">Select a replacement</option>
            {alternatives.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </select>
          {!alternatives.length && (
            <span className="text-amber-700">
              Add another {category.type} category first, then return to remove
              this one.
            </span>
          )}
        </label>
      )}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700"
        >
          {error}
        </p>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <button autoFocus disabled={busy} onClick={onClose}>
          Cancel
        </button>
        <button
          disabled={busy || (count > 0 && !replacement)}
          onClick={confirm}
          className="border-[#bd5353] bg-[#bd5353] text-white hover:bg-[#a34343]"
        >
          {busy ? "Removing…" : "Remove category"}
        </button>
      </div>
    </dialog>
  );
}
