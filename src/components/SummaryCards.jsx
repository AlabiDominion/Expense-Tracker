import { money, monthLabel } from "../utils/format";
export default function SummaryCards({ income, expense, month }) {
  return (
    <div className="mb-[23px] grid grid-cols-3 gap-[18px] max-[780px]:gap-[10px] max-[480px]:grid-cols-1 print:gap-[10px]">
      <article className="rounded-xl border border-[#e2e8e2] bg-white px-[23px] py-5 [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:text-[11px] [&>div]:text-[#7b8b80] [&_h2]:mt-[15px] [&_h2]:mb-[13px] [&_small]:text-[10px] [&_small]:text-[#9aa59d] max-[1100px]:p-[17px] max-[1100px]:[&_h2]:text-2xl max-[780px]:p-[14px] max-[780px]:[&_h2]:text-[21px] max-[780px]:[&_small]:text-[8px] max-[480px]:px-5 max-[480px]:py-[17px] max-[480px]:[&_h2]:mt-[6px] max-[480px]:[&_h2]:mb-[10px] max-[480px]:[&_h2]:text-[28px] max-[480px]:[&_small]:text-[10px] print:break-inside-avoid print:shadow-none print:[print-color-adjust:exact]">
        <div>
          <span>Total income</span>
          <span className="grid size-[31px] place-items-center rounded-lg bg-[#ffffff18] text-lg max-[780px]:size-[23px] bg-[#eaf5ed]! text-[#428d67]!">
            ↙
          </span>
        </div>
        <h2>{money(income)}</h2>
        <small>
          <span className="mr-[6px] text-[#358763]">↗ Money in</span> this month
        </small>
      </article>
      <article className="rounded-xl border border-[#e2e8e2] bg-white px-[23px] py-5 [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:text-[11px] [&>div]:text-[#7b8b80] [&_h2]:mt-[15px] [&_h2]:mb-[13px] [&_small]:text-[10px] [&_small]:text-[#9aa59d] max-[1100px]:p-[17px] max-[1100px]:[&_h2]:text-2xl max-[780px]:p-[14px] max-[780px]:[&_h2]:text-[21px] max-[780px]:[&_small]:text-[8px] max-[480px]:px-5 max-[480px]:py-[17px] max-[480px]:[&_h2]:mt-[6px] max-[480px]:[&_h2]:mb-[10px] max-[480px]:[&_h2]:text-[28px] max-[480px]:[&_small]:text-[10px] print:break-inside-avoid print:shadow-none print:[print-color-adjust:exact]">
        <div>
          <span>Total expenses</span>
          <span className="grid size-[31px] place-items-center rounded-lg bg-[#ffffff18] text-lg max-[780px]:size-[23px] bg-[#fff0e9]! text-[#d98a64]!">
            ↗
          </span>
        </div>
        <h2>{money(expense)}</h2>
        <small>
          <span className="mr-[6px] text-[#c7886c]">↗ Money out</span> this
          month
        </small>
      </article>
      <article className="rounded-xl border border-[#e2e8e2] bg-white px-[23px] py-5 [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:text-[11px] [&>div]:text-[#7b8b80] [&_h2]:mt-[15px] [&_h2]:mb-[13px] [&_small]:text-[10px] [&_small]:text-[#9aa59d] max-[1100px]:p-[17px] max-[1100px]:[&_h2]:text-2xl max-[780px]:p-[14px] max-[780px]:[&_h2]:text-[21px] max-[780px]:[&_small]:text-[8px] max-[480px]:px-5 max-[480px]:py-[17px] max-[480px]:[&_h2]:mt-[6px] max-[480px]:[&_h2]:mb-[10px] max-[480px]:[&_h2]:text-[28px] max-[480px]:[&_small]:text-[10px] print:break-inside-avoid print:shadow-none print:[print-color-adjust:exact] relative overflow-hidden border-[#254d3d]! bg-[#254d3d]! text-white [&>div]:text-[#b4c8bc]! [&_small]:text-[#b4c8bc]! after:pointer-events-none after:absolute after:right-[-60px] after:bottom-[-100px] after:size-[180px] after:rounded-full after:border after:border-[#ffffff0c] after:shadow-[0_0_0_25px_#ffffff03,0_0_0_50px_#ffffff03] after:content-[''] print:bg-[#f0f5f0]! print:text-[#23352e] print:[&>div]:text-[#63796b]! print:[&_small]:text-[#63796b]!">
        <div>
          <span>Net cash flow</span>
          <span className="grid size-[31px] place-items-center rounded-lg bg-[#ffffff18] text-lg max-[780px]:size-[23px]">
            ▣
          </span>
        </div>
        <h2>{money(income - expense)}</h2>
        <small>Income minus expenses · {monthLabel(month)}</small>
      </article>
    </div>
  );
}
