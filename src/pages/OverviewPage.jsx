import FinancialCharts from "../components/charts/FinancialCharts";
import TransactionTable from "../components/transactions/TransactionTable";
export default function OverviewPage({
  report,
  categories,
  onEdit,
  onDelete,
  onAdd,
  onViewAll,
}) {
  return (
    <>
      <FinancialCharts {...report} />
      <section className="overflow-hidden rounded-xl border border-[#e2e8e2] bg-white print:break-inside-avoid print:shadow-none">
        <div className="flex items-center justify-between gap-[15px] px-6 py-[22px] [&_p]:mt-[6px] [&_p]:text-[10px] max-[1100px]:px-[17px] max-[1100px]:py-5 max-[780px]:flex-wrap">
          <div>
            <h3>
              Recent transactions{" "}
              <span className="ml-[5px] rounded-[5px] bg-[#f0f4ef] px-[6px] py-[3px] text-[10px] text-[#8c9a8f]">
                {report.monthly.length}
              </span>
            </h3>
            <p>Your latest income and expenses</p>
          </div>
          <button
            className="border-0 p-0 text-[10px] text-[#3a8562]"
            onClick={onViewAll}
          >
            View all transactions ↗
          </button>
        </div>
        <TransactionTable
          transactions={report.monthly}
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          limit={5}
        />
      </section>
    </>
  );
}

