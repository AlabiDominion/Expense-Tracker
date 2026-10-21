export default function Brand({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src="/cloudberth-icon.png"
        alt=""
        className={compact ? "size-9 object-contain" : "size-12 object-contain"}
      />
      <span>
        <span
          className={`${compact ? "text-xl" : "text-[25px]"} block font-semibold tracking-[-.8px] text-[#071b2a]`}
        >
          CloudBerth<span className="text-[#0789d8]">.</span>
        </span>
        <span className="mt-1 block text-[8px] font-medium tracking-[2px] text-[#7891a1] uppercase">
          Expense Tracker
        </span>
      </span>
    </span>
  );
}
