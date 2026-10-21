import FinancialCharts from "../components/charts/FinancialCharts";
import TransactionTable from "../components/transactions/TransactionTable";
import { money, monthLabel } from "../utils/format";
import { downloadCsv } from "../utils/exportCsv";
export default function ReportsPage({
  report,
  categories,
  month,
  onEdit,
  onDelete,
  onAdd,
}) {
  const { monthly, breakdown, history, income, expense } = report;
  return (
    <>
      <FinancialCharts
        history={history}
        income={income}
        expense={expense}
        breakdown={breakdown}
      />{" "}
      <section className="overflow-hidden rounded-xl border border-[#e2e8e2] bg-white print:break-inside-avoid print:shadow-none pb-[10px] print:mt-5">
        <div className="flex items-center justify-between gap-[15px] px-6 py-[22px] [&_p]:mt-[6px] [&_p]:text-[10px] max-[1100px]:px-[17px] max-[1100px]:py-5 max-[780px]:flex-wrap">
          <div>
            <h3>CloudBerth · Monthly statement</h3>
            <p>
              {monthLabel(month)} · {monthly.length} transactions · NGN
            </p>
          </div>
          <div className="flex items-center gap-[10px] [&_input]:px-3 [&_input]:py-[11px] [&_input]:text-[11px] [&_button]:px-3 [&_button]:py-[11px] [&_button]:text-[11px] max-[1100px]:flex-wrap max-[1100px]:justify-end max-[780px]:justify-start print:hidden">
            <button onClick={() => downloadCsv(monthly, categories, month)}>
              ↓ Export CSV
            </button>
            <button
              className="border-[#087dbd] bg-[#087dbd] text-white hover:bg-[#06689e]"
              onClick={() => window.print()}
            >
              ↓ Save as PDF
            </button>
          </div>
        </div>
        <p className="px-6 pb-5 text-[11px] print:hidden">
          PDF opens a clean print view. Choose “Save as PDF” in the print
          dialog.
        </p>
        <div className="grid grid-cols-2 gap-3 px-6 pb-5 [&>div]:flex [&>div]:justify-between [&>div]:bg-[#f8faf6] [&>div]:p-3 [&>div]:text-xs max-[780px]:grid-cols-1">
          {breakdown.map((c) => (
            <div key={c.id}>
              <span>{c.name}</span>
              <strong>{money(c.total)}</strong>
            </div>
          ))}
        </div>
        <TransactionTable
          transactions={monthly}
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
        />
      </section>
    </>
  );
}
