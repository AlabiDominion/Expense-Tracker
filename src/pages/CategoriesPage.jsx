import DeleteCategoryDialog from "../components/categories/DeleteCategoryDialog";
import { useState } from "react";
import { money } from "../utils/format";
export default function CategoriesPage({
  categories,
  monthly,
  mode,
  onAddCategory,
  onDeleteCategory,
  transactions,
  notify,
}) {
  const [deleting, setDeleting] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("expense");
  async function addCategory(event) {
    event.preventDefault();
    try {
      await onAddCategory({
        name: categoryName.trim(),
        type: categoryType,
        color: "#788fa0",
        icon: "◇",
      });
      setCategoryName("");
      notify("Category added");
    } catch (error) {
      notify(error.message);
    }
  }
  return (
    <>
      {" "}
      <section className="overflow-hidden rounded-xl border border-[#e2e8e2] bg-white print:break-inside-avoid print:shadow-none mb-6 p-6 [&_form]:mt-5 [&_form]:flex [&_form]:gap-3 [&_input]:flex-1 max-[780px]:[&_form]:flex-wrap max-[780px]:[&_input]:min-w-[180px]">
        <h3>Add a category</h3>
        <form onSubmit={addCategory}>
          <input
            required
            maxLength={60}
            placeholder="e.g. Health & wellness"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <select
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button
            className="border-[#248461] bg-[#248461] text-white hover:bg-[#1a6f50]"
            disabled={mode !== "MySQL API" && mode !== "Local demo"}
          >
            ＋ Add category
          </button>
        </form>
      </section>
      <div className="grid grid-cols-3 gap-5 [&_article]:p-[23px] [&_h3]:mt-[18px] [&_p]:mt-[6px] [&_p]:text-[11px] [&_strong]:mt-[25px] [&_strong]:block [&_strong]:text-[23px] [&_small]:mt-[6px] [&_small]:block [&_small]:text-[#9aa69c] max-[780px]:grid-cols-2 max-[480px]:grid-cols-1">
        {categories.map((c) => (
          <article
            className="overflow-hidden rounded-xl border border-[#e2e8e2] bg-white print:break-inside-avoid print:shadow-none"
            key={c.id}
          >
            <span
              className="inline-grid size-[34px] shrink-0 place-items-center rounded-[9px] text-lg text-[color:var(--data-color)] [background:var(--data-background)]"
              style={{
                "--data-color": c.color,
                "--data-background": c.color + "18",
              }}
            >
              {c.icon}
            </span>
            <h3>{c.name}</h3>
            <p>{c.type === "income" ? "Income" : "Expense"} category</p>
            <strong>
              {money(
                monthly
                  .filter((t) => t.category_id === c.id)
                  .reduce((s, t) => s + Math.round(Number(t.amount) * 100), 0) /
                  100,
              )}
            </strong>
            <small>This month</small>
            <button
              className="mt-5 border-red-100 px-3 py-2 text-[11px] text-red-600 hover:bg-red-50"
              disabled={mode !== "MySQL API" && mode !== "Local demo"}
              aria-label={`Remove ${c.name} category`}
              onClick={() => setDeleting(c)}
            >
              Remove category
            </button>
          </article>
        ))}
      </div>
      {deleting && (
        <DeleteCategoryDialog
          category={deleting}
          categories={categories}
          transactions={transactions}
          onDelete={onDeleteCategory}
          onClose={() => setDeleting(null)}
          notify={notify}
        />
      )}
    </>
  );
}
