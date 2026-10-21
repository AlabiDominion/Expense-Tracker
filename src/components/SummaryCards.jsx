import { money, monthLabel } from "../utils/format";

function SummaryCard({ title, value, detail, icon, featured = false }) {
  return (
    <article className={`min-w-0 rounded-xl border px-5 py-5 print:break-inside-avoid print:[print-color-adjust:exact] ${featured ? "border-[#0d2b42] bg-[#0d2b42] text-white" : "border-[#e2e8e2] bg-white"}`}>
      <div className={`flex items-center justify-between gap-2 text-xs ${featured ? "text-[#a4c3d8]" : "text-[#7b8b80]"}`}>
        <span>{title}</span>
        <span aria-hidden="true" className={`grid size-8 shrink-0 place-items-center rounded-lg text-lg ${featured ? "bg-white/10" : "bg-[#eef4f6] text-[#287ba0]"}`}>{icon}</span>
      </div>
      <h2 className="mt-4 mb-3 break-words text-[clamp(20px,1.7vw,30px)]">{money(value)}</h2>
      <p className={`text-[10px] leading-relaxed ${featured ? "text-[#a4c3d8]" : "text-[#7b8b80]"}`}>{detail}</p>
    </article>
  );
}

export default function SummaryCards({ income, expense, month, totalNet, balanceAsOf }) {
  const dateLabel = new Date(`${balanceAsOf}T12:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="mb-[23px] grid grid-cols-4 gap-[18px] max-[1250px]:grid-cols-2 max-[780px]:gap-[10px] max-[480px]:grid-cols-1 print:grid-cols-2">
      <SummaryCard title="Total income" value={income} icon="↙" detail={`Money in · ${monthLabel(month)}`} />
      <SummaryCard title="Total expenses" value={expense} icon="↗" detail={`Money out · ${monthLabel(month)}`} />
      <SummaryCard title="Monthly net cash flow" value={(Math.round(income * 100) - Math.round(expense * 100)) / 100} icon="⇄" detail={`Income minus expenses · ${monthLabel(month)}`} />
      <SummaryCard title="Total net" value={totalNet} icon="▣" featured detail={`All recorded income minus expenses · As of ${dateLabel}`} />
    </div>
  );
}
