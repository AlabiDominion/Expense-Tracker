import { monthLabel } from "../../utils/format";
export default function Footer({ month }) {
  return (
    <footer className="mt-[25px] flex justify-between text-[9px] text-[#a3afa4] max-[780px]:gap-5 print:hidden">
      <span>ECEWS Expense Tracker</span>
      <span>All amounts in NGN · {monthLabel(month)}</span>
    </footer>
  );
}
