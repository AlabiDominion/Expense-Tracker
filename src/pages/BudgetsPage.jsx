import { useState } from "react";
import { money, monthLabel } from "../utils/format";
import { sumAmounts } from "../utils/reports";
import { allocationSummary } from "../utils/budgetPlan";
import MonthlyPlanEditor from "../components/planning/MonthlyPlanEditor";
import {
  panel,
  primary,
  field,
  Field,
  Dialog,
  Status,
} from "../components/planning/PlanningUI";
export default function BudgetsPage({
  planning,
  categories,
  transactions,
  month,
  onRefresh,
}) {
  const [form, setForm] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [removing, setRemoving] = useState(null);
  const rows = planning.budgets.filter((b) => b.month === month);
  const plan = planning.plans?.find((p) => p.month === month);
  const summary = allocationSummary(plan, rows);
  const actualIncome = sumAmounts(
    transactions.filter(
      (t) => t.type === "income" && t.transaction_date.startsWith(month),
    ),
  );
  const spent = (b) =>
    sumAmounts(
      transactions.filter(
        (t) =>
          t.type === "expense" &&
          t.category_id === b.category_id &&
          t.transaction_date.startsWith(month),
      ),
    );
  const limit = sumAmounts(rows),
    actual = rows.reduce((n, b) => n + Math.round(spent(b) * 100), 0) / 100;
  async function act(path, method, body) {
    setBusy(true);
    setError("");
    try {
      await planning.mutate(path, method, body);
      setForm(null);
      setRemoving(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (planning.loading || planning.error) return <Status {...planning} />;
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-[#0d2b42] p-6 text-white">
        <p className="text-xs text-sky-200">
          MAKE ROOM FOR WHAT MATTERS · {monthLabel(month)}
        </p>
        <div className="mt-5 grid grid-cols-3 gap-4 max-[600px]:grid-cols-1">
          {[
            ["Planned monthly income", plan?.income || 0],
            ["Total allocated", summary.allocated],
            ["Left to allocate", plan ? summary.left : 0],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-sky-100">{label}</p>
              <h2 className="mt-2 text-2xl">{money(value)}</h2>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-sky-100">
          Expense limits {money(limit)} · Savings {money(plan?.savings || 0)} ·
          Emergency fund {money(plan?.emergency || 0)}
        </p>
        {!plan && (
          <p className="mt-3 text-xs text-amber-200">
            Set income to check your allocation ceiling. Existing budgets are
            retained.
          </p>
        )}
      </section>
      <MonthlyPlanEditor
        key={month}
        plan={plan}
        month={month}
        actualIncome={actualIncome}
        onSave={(body) => planning.mutate("/monthly-plan", "PUT", body)}
        onApply={async (body) => {
          await planning.mutate("/budget-template", "POST", body);
          await onRefresh();
        }}
      />
      <div className={panel}>
        <p className="text-sm">
          Spent in budgeted categories: <strong>{money(actual)}</strong> ·
          Remaining spending allowance: <strong>{money(limit - actual)}</strong>
        </p>
        <p className="mt-2 text-xs text-slate-500">
          This allowance is separate from unallocated income. Unbudgeted
          spending is not included here.
        </p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[#547086]">
          Set a monthly limit for each expense category. Unbudgeted categories
          are excluded from these totals.
        </p>
        <button
          className={primary}
          disabled={!plan}
          onClick={() => {
            setError("");
            setForm({ category_id: "", amount: "" });
          }}
        >
          ＋ Set budget
        </button>
      </div>
      {!rows.length ? (
        <div className={panel}>
          <h3>Give your month a plan</h3>
          <p className="mt-2 text-sm">
            Start with food, transport or bills. Your existing expenses will
            automatically count toward the matching budget.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
          {rows.map((b) => {
            const used = spent(b),
              remaining = Number(b.amount) - used,
              percent = Math.round((used / Number(b.amount)) * 100);
            return (
              <article key={b.id} className={panel}>
                <div className="flex justify-between gap-3">
                  <h3>
                    {categories.find((c) => c.id === b.category_id)?.name ||
                      "Category"}
                  </h3>
                  <span
                    className={`text-xs ${remaining < 0 ? "text-red-600" : "text-[#087dbd]"}`}
                  >
                    {percent}% used
                  </span>
                </div>
                <p className="mt-5 text-xl font-semibold">
                  {money(used)}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    of {money(b.amount)}
                  </span>
                </p>
                <progress
                  className={`mt-4 h-2 w-full ${remaining < 0 ? "accent-red-500" : "accent-[#087dbd]"}`}
                  value={Math.min(percent, 100)}
                  max="100"
                  aria-label="Budget used"
                />
                <p className="mt-3 text-xs">
                  {money(Math.abs(remaining))}{" "}
                  {remaining < 0 ? "over budget" : "remaining"}
                </p>
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => {
                      setError("");
                      setForm(b);
                    }}
                  >
                    Edit limit
                  </button>
                  <button
                    onClick={() => {
                      setError("");
                      setRemoving(b);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {form && (
        <Dialog
          title="Set monthly budget"
          onClose={() => setForm(null)}
          busy={busy}
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              act("/budgets", "POST", {
                month,
                category_id: Number(form.category_id),
                amount: form.amount,
              });
            }}
          >
            <p className="text-xs">
              {monthLabel(month)} · Saving replaces this category’s existing
              limit.
            </p>
            <p className="text-xs text-[#087dbd]">
              Available for this category:{" "}
              {money(
                summary.left +
                  Number(
                    rows.find((b) => b.category_id === Number(form.category_id))
                      ?.amount || 0,
                  ),
              )}
            </p>
            <Field label="Expense category">
              <select
                required
                className={field}
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">Choose category</option>
                {categories
                  .filter((c) => c.type === "expense")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Monthly limit (NGN)">
              <input
                autoFocus
                required
                type="number"
                min="0.01"
                max="9999999999.99"
                step="0.01"
                className={field}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </Field>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <button disabled={busy} className={primary}>
              {busy ? "Saving…" : "Save budget"}
            </button>
          </form>
        </Dialog>
      )}
      {removing && (
        <Dialog
          title="Remove budget?"
          busy={busy}
          onClose={() => setRemoving(null)}
        >
          <p className="mb-4 text-sm">
            Remove this month’s limit? Your expense records will remain.
          </p>
          {error && <p role="alert">{error}</p>}
          <button
            className={primary}
            disabled={busy}
            onClick={() => act("/budgets/" + removing.id, "DELETE")}
          >
            Remove budget
          </button>
        </Dialog>
      )}
    </div>
  );
}
