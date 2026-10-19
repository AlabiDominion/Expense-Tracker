import { money } from "../../utils/format";
export default function TransactionTable({
  transactions,
  categories,
  onEdit,
  onDelete,
  onAdd,
  limit,
}) {
  const rows = transactions.slice(0, limit);
  return (
    <div className="overflow-auto print:overflow-visible">
      <table className="w-full border-collapse whitespace-nowrap [&_th]:border-y [&_th]:border-[#edf1eb] [&_th]:bg-[#fbfcfa] [&_th]:px-6 [&_th]:py-3 [&_th]:text-left [&_th]:text-[9px] [&_th]:font-medium [&_th]:text-[#99a49c] [&_td]:border-b [&_td]:border-[#f0f3ee] [&_td]:px-6 [&_td]:py-[15px] [&_td]:text-[11px] [&_tbody_tr:last-child_td]:border-0 max-[1100px]:[&_td]:px-4 max-[1100px]:[&_td]:py-[13px] max-[1100px]:[&_th]:px-4 max-[1100px]:[&_th]:py-[13px] print:[&_td]:p-[9px] print:[&_td]:text-[9px] print:[&_th]:p-[9px] print:[&_th]:text-[9px]">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Category</th>
            <th>Date</th>
            <th className="text-right!">Amount</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => {
            const c = categories.find((c) => c.id === t.category_id);
            return (
              <tr key={t.id}>
                <td>
                  <div className="flex items-center gap-3 [&_strong]:text-[11px] [&_small]:mt-[5px] [&_small]:block [&_small]:text-[9px] [&_small]:text-[#9ba49d]">
                    <span
                      className="inline-grid size-[34px] shrink-0 place-items-center rounded-[9px] text-lg [background:var(--data-background)] text-[color:var(--data-color)]"
                      style={{
                        "--data-background": `${c?.color}18`,
                        "--data-color": c?.color,
                      }}
                    >
                      {c?.icon || "◇"}
                    </span>
                    <span>
                      <strong>{t.description}</strong>
                      <small>
                        {t.source === "moniepoint_pdf"
                          ? "Moniepoint statement"
                          : t.type === "income"
                            ? "Money received"
                            : "Payment"}
                      </small>
                    </span>
                  </div>
                </td>
                <td>
                  <span className="inline-block rounded-[5px] bg-[#f4f6f1] px-2 py-[5px] text-[9px] text-[#89958a]">
                    {c?.name || "Uncategorized"}
                  </span>
                </td>
                <td className="text-[#89958e]">
                  {new Date(
                    t.transaction_date + "T12:00:00",
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td
                  className={`text-right font-semibold ${t.type === "income" ? "text-[#318b65]" : "text-[#59675c]"} `}
                >
                  {t.type === "income" ? "+" : "−"}
                  {money(t.amount)}
                </td>
                <td>
                  <div className="flex gap-1 [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-[6px] [&_button]:py-[2px] [&_button]:text-[#99a79c] [&_button:hover]:bg-[#f1f5ef] [&_button:hover]:text-[#2b7b5a] print:hidden">
                    <button title="Edit transaction" onClick={() => onEdit(t)}>
                      ✎
                    </button>
                    <button
                      title="Delete transaction"
                      onClick={() => onDelete(t)}
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!rows.length && (
        <div className="p-[45px] text-center leading-[2] text-[#89988b] [&_button]:border-0 [&_button]:text-xs [&_button]:text-[#258562]">
          No transactions here yet.
          <br />
          <button onClick={() => onAdd()}>Add your first transaction →</button>
        </div>
      )}
    </div>
  );
}
