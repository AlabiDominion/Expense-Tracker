import { useState } from "react";
import { projectRepayment } from "../../utils/repayment";
import { money } from "../../utils/format";
import { panel, field, Field } from "./PlanningUI";
export default function RepaymentPlanner({ debts }) {
  const [payment, setPayment] = useState(""),
    [strategy, setStrategy] = useState("avalanche");
  const minimum =
    debts.filter(d => Number(d.balance) > 0).reduce((s, d) => s + Math.min(Math.round(Number(d.minimum_payment) * 100), Math.round(Number(d.balance) * 100)), 0) /
    100;
  const result = projectRepayment(debts, payment, strategy);
  const finish = new Date();
  finish.setMonth(finish.getMonth() + (result.months || 0), 1);
  return (
    <section className={panel}>
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-sky-50 text-xl text-[#087dbd]">
          ↗
        </span>
        <div>
          <h3>Build your repayment plan</h3>
          <p className="mt-1 text-xs text-slate-500">
            Explore a payment you can sustain after essentials and a buffer.
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
        <Field label="Total payment each month (NGN)">
          <input
            className={field}
            type="number"
            min="0.01"
            step="0.01"
            value={payment}
            placeholder={String(Math.max(minimum, 10000))}
            onChange={(e) => setPayment(e.target.value)}
          />
        </Field>
        <Field label="Repayment approach">
          <select
            className={field}
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
          >
            <option value="avalanche">Highest interest first</option>
            <option value="snowball">Smallest balance first</option>
          </select>
        </Field>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Combined minimums: {money(minimum)}.{" "}
        {strategy === "avalanche"
          ? "Direct extra payments to the highest APR to reduce interest costs."
          : "Direct extra payments to the smallest balance for earlier milestones."}{" "}
        Minimums on other debts remain included.
      </p>
      {payment &&
        (result.error ? (
          <p
            role="status"
            className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900"
          >
            {result.error}
          </p>
        ) : (
          <div className="mt-5 rounded-xl bg-[#0d2b42] p-5 text-white">
            <p className="text-xs text-sky-100">ESTIMATED PAYOFF</p>
            <h2 className="mt-2 text-3xl">
              {result.months === 0 ? "All clear" : `${result.months} months`}
            </h2>
            <p className="mt-2 text-sm">
              {result.months > 0 &&
                `Around ${finish.toLocaleDateString("en-NG", { month: "long", year: "numeric" })} · `}
              Estimated interest {money(result.interest)} · Total paid{" "}
              {money(result.total)}
            </p>
            <div
              className="mt-5 flex h-20 items-end gap-1"
              role="img"
              aria-label="Projected debt balance decreasing over the repayment period"
            >
              {result.schedule
                .filter(
                  (_, i) =>
                    i % Math.max(1, Math.ceil(result.schedule.length / 24)) ===
                    0,
                )
                .map((r) => (
                  <div
                    key={r.month}
                    title={`Month ${r.month}: ${money(r.remaining)}`}
                    className="min-w-1 flex-1 rounded-t bg-sky-400"
                    style={{
                      height: `${Math.max(3, (r.remaining / Math.max(...result.schedule.map((s) => s.remaining), 1)) * 100)}%`,
                    }}
                  />
                ))}
            </div>
          </div>
        ))}
      <p className="mt-5 text-xs leading-6 text-slate-500">
        Estimates assume fixed annual rates, interest charged monthly on the
        remaining balance, no new borrowing or fees, and the first payment next
        month. Freed payments roll into the next debt. Flat-rate, daily-interest
        and fee-based loans need different calculations. Check the entered APR
        against your lender’s terms; this is a planning estimate, not a payment
        instruction.
      </p>
    </section>
  );
}
