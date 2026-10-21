import { useEffect, useState } from "react";
import Brand from "./Brand";

export default function StartupScreen({ children }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = overflow;
    }, 5000);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = overflow;
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
          className="fixed inset-0 z-[1000] grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_46%,#ffffff_0%,#edf5fb_55%,#e5eef5_100%)] animate-startup-exit motion-reduce:animate-none"
          role="status"
          aria-live="polite"
          aria-label="Welcome to CloudBerth Expense Tracker. Preparing your workspace."
        >
          <div className="relative z-1 p-8 text-center animate-startup-enter motion-reduce:animate-none">
            <div className="inline-flex rounded-[18px] border border-[#dce7ef] bg-white p-6 shadow-[0_12px_40px_#123a5a08]">
              <Brand />
            </div>
            <h1 className="mt-8 text-[clamp(32px,5vw,48px)] leading-[1.23] tracking-[-1.8px] text-[#0d2b42]">
              A clearer view.
              <br />
              <span className="text-[#789bb4]">A better tomorrow.</span>
            </h1>
            <p className="mt-5 text-[13px] text-[#839cac]">
              Your finances, thoughtfully organized.
            </p>
            <div
              className="mx-auto mt-[38px] mb-4 h-[3px] w-[180px] overflow-hidden rounded-full bg-[#dce8f1]"
              aria-hidden="true"
            >
              <span className="block h-full origin-left rounded-full bg-[#0789d8] animate-startup-progress motion-reduce:animate-none" />
            </div>
            <span className="text-[10px] tracking-[.35px] text-[#90a6b5]">
              Preparing your workspace
            </span>
          </div>
          <span className="absolute bottom-9 text-[10px] tracking-[1px] text-[#91a7b6]">
            A free tool by CloudBerth Technologies
          </span>
        </div>
      )}
    </>
  );
}
