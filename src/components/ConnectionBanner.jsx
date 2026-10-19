export default function ConnectionBanner({ mode, error, onRetry, onDemo }) {
  if (mode === "Local demo")
    return (
      <div className="mt-[-9px] mb-5 text-[10px] text-[#8c947f] print:hidden">
        Presentation demo · Sample data and changes stay in this browser,
        separate from MySQL.
      </div>
    );
  if (mode === "Connecting")
    return (
      <div
        className="mt-[-9px] mb-5 text-[10px] text-[#8c947f] print:hidden"
        role="status"
      >
        Connecting to your workspace…
      </div>
    );
  if (!error) return null;
  return (
    <div
      className="mb-[22px] flex items-center justify-between gap-4 rounded-[10px] border border-[#ead5ca] bg-[#fff8f2] px-5 py-4 [&_p]:text-xs [&_p]:text-[#875d45] [&>div]:flex [&>div]:shrink-0 [&>div]:gap-2 [&_button]:px-[10px] [&_button]:py-2 [&_button]:text-[11px] max-[780px]:flex-col max-[780px]:items-start print:hidden"
      role="alert"
    >
      <p>{error}</p>
      <div>
        <button onClick={onRetry}>Retry connection</button>
        <button onClick={onDemo}>Open presentation demo</button>
      </div>
    </div>
  );
}
