import { money } from "../../utils/format";
export default function FinancialCharts({
  history,
  income,
  expense,
  breakdown,
}) {
  const max = Math.max(...history.map((h) => Math.max(h.income, h.expense)), 1);
  let cursor = 0;
  const gradient = breakdown
    .map((c) => {
      const start = cursor;
      cursor += (c.total / expense) * 100;
      return `${c.color} ${start}% ${cursor}%`;
    })
    .join(",");
  return (
    <div className="mb-[23px] grid grid-cols-[1.6fr_1fr] gap-[22px] max-[1100px]:grid-cols-[1.3fr_1fr] max-[1100px]:gap-[15px] max-[780px]:grid-cols-1 print:grid-cols-[1.4fr_1fr]">
      <section className="overflow-hidden rounded-xl border border-[#e2e8e2] bg-white print:break-inside-avoid print:shadow-none">
        <div className="flex items-center justify-between gap-[15px] px-6 py-[22px] [&_p]:mt-[6px] [&_p]:text-[10px] max-[1100px]:px-[17px] max-[1100px]:py-5 max-[780px]:flex-wrap">
          <div>
            <h3>Cash flow</h3>
            <p>A six-month view of your money</p>
          </div>
          <div className="flex gap-[13px] text-[9px] text-[#8a978e] [&_span]:flex [&_span]:items-center [&_span]:gap-[6px] [&_i]:inline-block [&_i]:size-[7px] [&_i]:shrink-0 [&_i]:rounded-full max-[1100px]:gap-[6px]">
            <span>
              <i className="bg-[#238b6d]" />
              Income
            </span>
            <span>
              <i className="bg-[#c7dbd3]" />
              Expenses
            </span>
          </div>
        </div>
        <div className="mt-[13px] mr-6 mb-[14px] ml-5 flex h-[210px] gap-[15px] min-[1500px]:h-[245px]">
          <div className="flex w-[30px] flex-col justify-between pb-6 text-[9px] text-[#9ba79e]">
            {[1, 0.75, 0.5, 0.25, 0].map((n) => (
              <span key={n}>{Math.round((max * n) / 1000)}k</span>
            ))}
          </div>
          <div className="flex flex-1 justify-around bg-[repeating-linear-gradient(to_top,transparent_0,transparent_calc(25%_-_1px),#f0f3ef_calc(25%_-_1px),#f0f3ef_25%)] bg-size-[100%_calc(100%_-_24px)] bg-no-repeat">
            {history.map((h, i) => (
              <div
                className="flex w-[12%] flex-col items-center gap-3 [&>span]:h-3 [&>span]:text-[10px] [&>span]:text-[#8d9a90]"
                key={i}
              >
                <div className="flex size-full items-end justify-center gap-[5px] [&_div]:min-h-px [&_div]:w-[18px] [&_div]:rounded-t [&_div]:bg-[#238b6d] [&_div]:transition-[height] [&_div]:duration-400 [&_div+div]:bg-[#c7dbd3] print:[&_div]:[print-color-adjust:exact]">
                  <div
                    title={`${h.label} income: ${money(h.income)}`}
                    style={{
                      "--bar-height": `${(h.income / max) * 100}%`,
                    }}
                    className="h-[var(--bar-height)]"
                  />
                  <div
                    title={`${h.label} expenses: ${money(h.expense)}`}
                    style={{
                      "--bar-height": `${(h.expense / max) * 100}%`,
                    }}
                    className="h-[var(--bar-height)]"
                  />
                </div>
                <span>{h.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-6 border-t border-[#edf0ec] py-[15px] text-[10px] text-[#8b998c]">
          {income > expense
            ? "You earned more than you spent this month. Keep it up."
            : expense
              ? "Your spending exceeded your income this month."
              : "Add transactions to see your monthly insights."}
        </div>
      </section>
      <section className="overflow-hidden rounded-xl border border-[#e2e8e2] bg-white print:break-inside-avoid print:shadow-none">
        <div className="flex items-center justify-between gap-[15px] px-6 py-[22px] [&_p]:mt-[6px] [&_p]:text-[10px] max-[1100px]:px-[17px] max-[1100px]:py-5 max-[780px]:flex-wrap">
          <div>
            <h3>Where it went</h3>
            <p>Expenses by category</p>
          </div>
          <span className="text-[#89958e]">◷</span>
        </div>
        <div
          className="mx-auto mb-5 size-[164px] rounded-full p-[21px] [&>div]:flex [&>div]:size-full [&>div]:flex-col [&>div]:items-center [&>div]:justify-center [&>div]:gap-[7px] [&>div]:rounded-full [&>div]:bg-white [&_small]:text-[10px] [&_small]:text-[#9aa49d] [&_strong]:text-[19px] [&_strong]:tracking-[-.7px] min-[1500px]:mb-[25px] min-[1500px]:size-[185px] max-[780px]:mt-[7px] print:[print-color-adjust:exact] [background:var(--data-background)]"
          role="img"
          aria-label={`Total expenses ${money(expense)}. ${breakdown.map((c) => `${c.name}: ${money(c.total)}`).join(". ")}`}
          style={{
            "--data-background": expense
              ? `conic-gradient(${gradient})`
              : "#edf1ed",
          }}
        >
          <div>
            <small>Total spent</small>
            <strong>{money(expense)}</strong>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-[13px] px-[25px] pb-5 text-[9px] [&>div]:flex [&>div]:justify-between [&>div]:gap-[5px] [&_span]:flex [&_span]:items-center [&_span]:gap-[6px] [&_span]:text-[#849087] [&_i]:inline-block [&_i]:size-[7px] [&_i]:shrink-0 [&_i]:rounded-full [&_strong]:text-[10px] [&_strong]:text-[#65756a] min-[1500px]:pb-[25px] max-[1100px]:grid-cols-1 max-[780px]:grid-cols-2 max-[480px]:gap-3 print:grid-cols-1">
          {breakdown.map((c) => (
            <div key={c.id}>
              <span>
                <i
                  style={{
                    "--data-background": c.color,
                  }}
                  className="[background:var(--data-background)]"
                />
                {c.name}
              </span>
              <strong>{Math.round((c.total / expense) * 100)}%</strong>
            </div>
          ))}
          {!expense && <p className="text-[#89958e]">No expenses this month</p>}
        </div>
      </section>
    </div>
  );
}
