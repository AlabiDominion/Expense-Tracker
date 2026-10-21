export default function TransactionDrawer({
  form,
  setForm,
  categories,
  busy,
  error,
  onSave,
}) {
  return (
    <div
      className="fixed inset-0 z-30 flex justify-end bg-[#071b2a66] backdrop-blur-[3px]"
      onClick={() => !busy && setForm(null)}
    >
      <section
        className="h-full w-[450px] max-w-full overflow-auto bg-white px-2 py-[10px] shadow-[-15px_0_70px_#12302020] [&_h2]:text-2xl [&_form]:px-6 [&_form]:py-[10px] [&_label]:my-[22px] [&_label]:grid [&_label]:gap-[9px] [&_label]:text-xs [&_label]:text-[#64796b] [&_input]:p-[13px] [&_select]:p-[13px] [&>div_button]:border-0 [&>div_button]:text-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-[15px] px-6 py-[22px] [&_p]:mt-[6px] [&_p]:text-[10px] max-[1100px]:px-[17px] max-[1100px]:py-5 max-[780px]:flex-wrap">
          <div>
            <div className="mb-[10px] text-[9px] font-semibold tracking-[1.8px] text-[#7d94a5]">
              KEEP YOUR BOOKS UP TO DATE
            </div>
            <h2 id="form-title">
              {form.id ? "Edit transaction" : "Add transaction"}
            </h2>
          </div>
          <button aria-label="Close" onClick={() => setForm(null)}>
            ×
          </button>
        </div>
        <form onSubmit={onSave}>
          <div className="flex gap-[5px] rounded-[10px] bg-[#f2f6f1] p-[5px] [&_button]:flex-1 [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[#8a9b8d]">
            {["expense", "income"].map((t) => (
              <button
                type="button"
                key={t}
                className={
                  form.type === t
                    ? "bg-white! text-[#0789d8]! shadow-[0_2px_5px_#1430200a]"
                    : ""
                }
                onClick={() =>
                  setForm({
                    ...form,
                    type: t,
                    category_id: categories.find((c) => c.type === t)?.id || "",
                  })
                }
              >
                {t === "expense" ? "↗ Expense" : "↙ Income"}
              </button>
            ))}
          </div>
          <label>
            Amount (NGN)
            <input
              autoFocus
              required
              type="number"
              min="0.01"
              max="9999999999.99"
              step="0.01"
              value={form.amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount: e.target.value,
                })
              }
              placeholder="0.00"
            />
          </label>
          <label>
            Description
            <input
              required
              maxLength={200}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder="What was this for?"
            />
          </label>
          <label>
            Category
            <select
              required
              value={form.category_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  category_id: e.target.value,
                })
              }
            >
              <option value="">Select a category</option>
              {categories
                .filter((c) => c.type === form.type)
                .map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Date
            <input
              required
              type="date"
              value={form.transaction_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  transaction_date: e.target.value,
                })
              }
            />
          </label>
          {error && (
            <p role="alert" className="bg-[#fff1ef] p-[10px] text-[#b4544e]">
              {error}
            </p>
          )}
          <div className="mt-8 flex justify-end gap-[10px]">
            <button type="button" onClick={() => setForm(null)}>
              Cancel
            </button>
            <button
              className="border-[#087dbd] bg-[#087dbd] text-white hover:bg-[#06689e]"
              disabled={busy}
            >
              {busy ? "Saving…" : "Save transaction"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
