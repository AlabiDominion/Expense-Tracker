export default function PageHeading({
  page,
  month,
  onMonthChange,
  mode,
  onAdd,
}) {
  if (page === "Account") return <div className="mb-7"><div className="mb-3 text-[9px] font-semibold tracking-[1.8px] text-[#7d94a5]">YOUR PERSONAL WORKSPACE</div><h1>Account settings</h1><p className="mt-3 text-xs">Manage your profile and stay in control of your data.</p></div>;
  return (
    <div className="mb-6 flex items-center justify-between gap-5 [&_p]:mt-[9px] [&_p]:text-xs max-[1100px]:items-start max-[780px]:flex-col max-[480px]:[&_h1]:text-[28px]">
      <div>
        <div className="mb-[10px] text-[9px] font-semibold tracking-[1.8px] text-[#7d94a5]">
          YOUR FINANCIAL PICTURE
        </div>
        <h1>{page === "Overview" ? "A little more clarity." : page}</h1>
        <p>
          {page === "Overview"
            ? "Welcome back. Here’s where your money stands."
            : page === "Transactions"
              ? "Every move, all in one place."
              : page === "Reports"
                ? "Turn your everyday numbers into useful insights."
                : "Organize your money in a way that makes sense to you."}
        </p>
      </div>
      <div className="flex items-center gap-[10px] [&_input]:px-3 [&_input]:py-[11px] [&_input]:text-[11px] [&_button]:px-3 [&_button]:py-[11px] [&_button]:text-[11px] max-[1100px]:flex-wrap max-[1100px]:justify-end max-[780px]:justify-start print:hidden">
        <input
          aria-label="Report month"
          type="month"
          value={month}
          onChange={(e) => e.target.value && onMonthChange(e.target.value)}
        />
        <button
          className="border-[#087dbd] bg-[#087dbd] text-white hover:bg-[#06689e]"
          disabled={mode !== "MySQL API" && mode !== "Local demo"}
          onClick={() => onAdd()}
        >
          ＋ Add transaction
        </button>
      </div>
    </div>
  );
}
