import { Link } from "react-router-dom";
import Brand from "../components/Brand";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#183247]">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-6 py-6">
        <Link to="/" aria-label="CloudBerth Expense Tracker home">
          <Brand />
        </Link>
        <div className="flex items-center gap-5 text-xs">
          <a
            href="https://cloudberth.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#72899a] max-[600px]:hidden"
          >
            Meet CloudBerth ↗
          </a>
          <Link to="/login" className="font-semibold">
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-[#087dbd] px-5 py-3 font-medium text-white hover:bg-[#06689e]"
          >
            Get started free
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-[1200px] px-6 pb-12 pt-16 max-[780px]:pt-8">
        <section className="grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="inline-flex rounded-full border border-[#d9e7ef] bg-white px-4 py-2 text-[10px] tracking-[1.3px] text-[#66879d]">
              A FREE TOOL BY CLOUDBERTH TECHNOLOGIES
            </span>
            <h1 className="mt-7 text-[clamp(42px,5.5vw,68px)] leading-[1.08] font-semibold tracking-[-2.6px]">
              Your money.
              <br />A little more{" "}
              <span className="text-[#0789d8]">clarity.</span>
            </h1>
            <p className="mt-6 max-w-[440px] text-[15px] leading-[1.9] text-[#7a8f9f]">
              Know what comes in, see where it goes, and make room for what
              matters. Your own finance workspace, free to use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-lg bg-[#0d2b42] px-6 py-4 text-sm font-medium text-white hover:bg-[#174563]"
              >
                Create your free account →
              </Link>
              <Link
                to="/demo/overview"
                className="rounded-lg border border-[#d8e3eb] bg-white px-6 py-4 text-sm font-medium hover:bg-[#edf5fa]"
              >
                Explore the demo
              </Link>
            </div>
            <p className="mt-4 text-[10px] text-[#8aa0af]">
              No card needed. No bank connection required.
            </p>
          </div>
          <div className="relative rounded-[24px] bg-[#e6eff5] p-6 max-[600px]:p-4">
            <div className="rounded-2xl border border-[#dbe5ec] bg-white p-6 shadow-[0_30px_70px_-35px_#123a5a55]">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <span className="text-[9px] tracking-[1.5px] text-[#90a1af]">
                    YOUR FINANCIAL PICTURE
                  </span>
                  <h3 className="mt-2 text-xl">Everything in perspective.</h3>
                </div>
                <span className="rounded-full bg-[#e6f2fb] px-3 py-2 text-[9px] text-[#087dbd]">
                  Sample preview
                </span>
              </div>
              <div className="rounded-xl bg-[#0d2b42] p-6 text-white">
                <span className="text-[11px] text-[#99bdd5]">
                  Monthly net cash flow
                </span>
                <h2 className="mt-4 text-[35px]">
                  ₦245,000<span className="text-[#6c98b6]">.00</span>
                </h2>
                <span className="mt-4 block text-[10px] text-[#a4c0d3]">
                  A clearer picture of your everyday finances
                </span>
              </div>
              <div
                className="mt-7 flex h-[120px] items-end justify-between gap-3 border-b border-[#e3edf3] pb-3"
                aria-label="Illustrative cash flow chart"
              >
                {[38, 65, 50, 80, 56, 95, 72, 90].map((height, index) => (
                  <div
                    key={index}
                    className="flex h-full flex-1 items-end gap-1"
                  >
                    <div
                      className="h-[var(--preview-height)] w-1/2 rounded-t bg-[#0789d8]"
                      style={{ "--preview-height": height + "%" }}
                    />
                    <div
                      className="h-[var(--preview-height)] w-1/2 rounded-t bg-[#cce2f0]"
                      style={{ "--preview-height": height * 0.6 + "%" }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-between text-[10px] text-[#8aa0af]">
                <span>Less guesswork.</span>
                <span>More peace of mind.</span>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-20 grid gap-5 md:grid-cols-3">
          {[
            [
              "01",
              "Every transaction, organized",
              "Track income and expenses with categories that make sense to you.",
            ],
            [
              "02",
              "Your statement, simplified",
              "Upload a supported bank statement PDF, review the entries, and import what you approve.",
            ],
            [
              "03",
              "A workspace of your own",
              "Your records, monthly charts, and exports belong to your personal account.",
            ],
          ].map(([n, title, text]) => (
            <article
              key={n}
              className="rounded-xl border border-[#dfe7ed] bg-white p-6"
            >
              <span className="text-[10px] text-[#0789d8]">{n}</span>
              <h3 className="mt-5">{title}</h3>
              <p className="mt-3 text-xs leading-[1.9] text-[#8195a4]">
                {text}
              </p>
            </article>
          ))}
        </section>
        <footer className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-[#dfe7ed] pt-7 text-[11px] text-[#8aa0af]">
          <span>
            A little more clarity, courtesy of{" "}
            <a
              href="https://cloudberth.com"
              className="text-[#0c76b0]"
              target="_blank"
              rel="noreferrer"
            >
              CloudBerth Technologies ↗
            </a>
          </span>
          <Link to="/privacy">Privacy & your data</Link>
        </footer>
      </main>
    </div>
  );
}
