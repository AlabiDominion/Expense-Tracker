import { useState } from "react";
import TransactionTable from "../components/transactions/TransactionTable";
import TransactionFilters from "../components/transactions/TransactionFilters";
import { filterTransactions } from "../utils/reports";
import { downloadCsv } from "../utils/exportCsv";
export default function TransactionsPage({
  report,
  categories,
  month,
  onEdit,
  onDelete,
  onAdd,
  onImport,
  canImport,
}) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const filtered = filterTransactions(report.monthly, {
    search,
    type,
    category,
  });
  return (
    <section className="overflow-hidden rounded-xl border border-[#e2e8e2] bg-white print:break-inside-avoid print:shadow-none">
      <div className="flex items-center justify-between gap-[15px] px-6 py-[22px] [&_p]:mt-[6px] [&_p]:text-[10px] max-[1100px]:px-[17px] max-[1100px]:py-5 max-[780px]:flex-wrap">
        <div>
          <h3>
            All transactions{" "}
            <span className="ml-[5px] rounded-[5px] bg-[#f0f4ef] px-[6px] py-[3px] text-[10px] text-[#8c9a8f]">
              {report.monthly.length}
            </span>
          </h3>
          <p>Your latest income and expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={!canImport}
            onClick={onImport}
            className="border-[#087dbd] bg-[#087dbd] text-white hover:bg-[#06689e]"
            title={
              canImport
                ? "Upload a bank statement PDF"
                : "Switch to Live database to import a statement"
            }
          >
            ↑ Import PDF
          </button>
          <button onClick={() => downloadCsv(filtered, categories, month)}>
            ↓ Export CSV
          </button>
        </div>
      </div>
      <TransactionFilters
        {...{
          categories,
          search,
          setSearch,
          type,
          setType,
          category,
          setCategory,
        }}
      />
      <TransactionTable
        transactions={filtered}
        categories={categories}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
      />
    </section>
  );
}
