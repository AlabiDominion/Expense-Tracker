export default function StatementReviewTable({
  rows,
  categories,
  page,
  busy,
  onUpdate,
}) {
  const field =
    "w-full rounded-md border border-[#dce6ed] bg-white px-2 py-2 text-[11px]";
  return (
    <div className="max-h-[360px] overflow-auto rounded-lg border border-[#e2e8e2] bg-white">
      <table className="w-full min-w-[880px] text-left text-[11px]">
        <thead className="sticky top-0 z-1 bg-[#edf3ed] text-[#6e8273]">
          <tr>
            {[
              "Import",
              "Date",
              "Description",
              "Type",
              "Amount (NGN)",
              "Category",
              "Status",
            ].map((h) => (
              <th className="p-3 font-medium" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(page * 20, (page + 1) * 20).map((row) => (
            <tr
              key={row.row_id}
              className={`border-t border-[#edf1eb] ${row.duplicate ? "bg-[#f6f7f5] opacity-60" : ""}`}
            >
              <td className="p-3">
                <input
                  aria-label={`Select transaction ${row.row_id + 1}`}
                  type="checkbox"
                  checked={row.selected}
                  disabled={busy || row.duplicate}
                  onChange={(e) =>
                    onUpdate(row.row_id, {
                      selected: e.target.checked,
                    })
                  }
                  className="size-4 accent-[#087dbd]"
                />
              </td>
              <td className="p-2">
                <input
                  required
                  aria-label={`Date for row ${row.row_id + 1}`}
                  type="date"
                  className={field}
                  value={row.transaction_date}
                  disabled={busy || row.duplicate}
                  onChange={(e) =>
                    onUpdate(row.row_id, {
                      transaction_date: e.target.value,
                    })
                  }
                />
              </td>
              <td className="min-w-[230px] p-2">
                <input
                  required
                  aria-label={`Description for row ${row.row_id + 1}`}
                  maxLength={200}
                  className={field}
                  value={row.description}
                  disabled={busy || row.duplicate}
                  onChange={(e) =>
                    onUpdate(row.row_id, {
                      description: e.target.value,
                    })
                  }
                />
              </td>
              <td className="p-2">
                <select
                  aria-label={`Type for row ${row.row_id + 1}`}
                  className={field}
                  value={row.type}
                  disabled={busy || row.duplicate}
                  onChange={(e) =>
                    onUpdate(row.row_id, {
                      type: e.target.value,
                      category_id: null,
                    })
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </td>
              <td className="min-w-[110px] p-2">
                <input
                  aria-label={`Amount for row ${row.row_id + 1}`}
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={field}
                  value={row.amount}
                  disabled={busy || row.duplicate}
                  onChange={(e) =>
                    onUpdate(row.row_id, {
                      amount: e.target.value,
                    })
                  }
                />
              </td>
              <td className="min-w-[150px] p-2">
                <select
                  aria-label={`Category for row ${row.row_id + 1}`}
                  className={field}
                  value={row.category_id || ""}
                  disabled={busy || row.duplicate}
                  onChange={(e) =>
                    onUpdate(row.row_id, {
                      category_id: e.target.value,
                    })
                  }
                >
                  <option value="">Uncategorized</option>
                  {categories
                    .filter((c) => c.type === row.type)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </td>
              <td className="whitespace-nowrap p-3 text-[10px] text-[#7d94a5]">
                {row.duplicate
                  ? "Already imported"
                  : row.possible_duplicate
                    ? "Possible duplicate"
                    : row.category_id
                      ? "Category suggested"
                      : "Needs category"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
