import { useEffect, useState } from "react";
// The app mounts immediately so the API loads behind the welcome screen.
export default function StartupScreen({ children }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = previousOverflow;
    }, 5000);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return (
    <>
      <div
        inert={visible ? true : undefined}
        aria-hidden={visible ? true : undefined}
      >
        {children}
      </div>
      {visible && (
        <div
          className="fixed inset-0 z-[1000] grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_46%,#ffffff_0%,#f3f8f3_55%,#e9f1e9_100%)] animate-startup-exit motion-reduce:animate-none"
          role="status"
          aria-live="polite"
          aria-label="Welcome to ECEWS Expense Tracker. Preparing your workspace."
        >
          <div
            className="pointer-events-none absolute aspect-square w-[min(690px,120vw)] rounded-full border border-[#62866d0c] after:absolute after:top-[14%] after:left-[14%] after:size-[7px] after:rounded-full after:bg-[#9cbba56b] after:content-['']"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute aspect-square w-[min(690px,120vw)] rounded-full border border-[#62866d0c] w-[min(540px,97vw)]! border-[#62866d0a]!"
            aria-hidden="true"
          />
          <div className="relative z-1 p-8 text-center animate-startup-enter motion-reduce:animate-none [&_h1]:text-[clamp(32px,5vw,48px)] [&_h1]:leading-[1.23] [&_h1]:font-semibold [&_h1]:tracking-[-1.8px] [&_h1]:text-[#254d3d] [&_h1_span]:text-[#7d9682] [&_p]:mt-[18px] [&_p]:text-[13px] [&_p]:text-[#84978a] select-none">
            <div className="inline-flex items-center justify-center rounded-[18px] border border-[#e1eae1] bg-[#ffffffd9] px-[26px] py-5 shadow-[0_12px_40px_#234d3d08] [&_img]:block [&_img]:h-auto [&_img]:w-[220px] [&_img]:max-w-[60vw]">
              <img src="/ecews-logo.png" alt="ECEWS" />
            </div>
            <span className="mt-[27px] mb-[18px] block text-[10px] font-semibold tracking-[3.5px] text-[#6f8b78]">
              EXPENSE TRACKER
            </span>
            <h1>
              A clearer view.
              <br />
              <span>A better tomorrow.</span>
            </h1>
            <p>Your finances, thoughtfully organized.</p>
            <div
              className="mx-auto mt-[38px] mb-[15px] h-[3px] w-[180px] overflow-hidden rounded-[9px] bg-[#dfe9df] [&_span]:block [&_span]:h-full [&_span]:origin-left [&_span]:rounded-[inherit] [&_span]:bg-[#278763] [&_span]:animate-startup-progress motion-reduce:[&_span]:animate-none"
              aria-hidden="true"
            >
              <span />
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] tracking-[.35px] text-[#8a9c8e]">
              <span
                className="size-[5px] rounded-full bg-[#388d68] animate-startup-pulse motion-reduce:animate-none"
                aria-hidden="true"
              />
              Preparing your workspace
            </div>
          </div>
          <span className="absolute bottom-[35px] text-[10px] tracking-[1px] text-[#9eafa0]">
            Clarity in every transaction.
          </span>
        </div>
      )}
    </>
  );
}
