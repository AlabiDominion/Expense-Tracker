import { Link } from "react-router-dom";
import { monthLabel } from "../../utils/format";
export default function Footer({ month }) {
  return (
    <footer className="mt-[25px] flex flex-wrap justify-between gap-4 text-[9px] text-[#93a7b6] print:hidden">
      <span>
        A free tool by{" "}
        <a
          href="https://cloudberth.com"
          target="_blank"
          rel="noreferrer"
          className="text-[#0789d8]"
        >
          CloudBerth Technologies ↗
        </a>
      </span>
      <span>
        NGN · {monthLabel(month)} ·{" "}
        <Link to="/privacy">Privacy & your data</Link>
      </span>
    </footer>
  );
}
