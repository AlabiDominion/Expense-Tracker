import { useState } from "react";
import { money } from "../../utils/format";
import {
  allocationSummary,
  buildBudgetTemplate,
  recommendTemplate,
} from "../../utils/budgetPlan";
import { Dialog, Field, field, primary, panel } from "./PlanningUI";

export default function MonthlyPlanEditor({
  plan,
  month,
  actualIncome,
  onSave,
  onApply,
}) {
  const [editing, setEditing] = useState(false),
    [draft, setDraft] = useState(null),
    [preview, setPreview] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  function open() {
    setDraft(
      plan
        ? { ...plan }
        : {
            month,
            income: actualIncome > 0 ? String(actualIncome) : "",
            savings: "0",
            emergency: "0",
            annual_rent: "0",
            household_size: 1,
          },
    );
    setError("");
    setEditing(true);
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSave({ ...draft, month });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  function suggest(kind) {
    try {
      setError("");
      setPreview(buildBudgetTemplate(plan, kind));
    } catch (err) {
      setError(err.message);
    }
  }
  const recommended = plan ? recommendTemplate(plan) : null;
  return (
    <section className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3>
            {plan ? "Your monthly income plan" : "Start with what you earn"}
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Enter take-home income for this month. Planning income does not
            create an income transaction.
          </p>
        </div>
        <button className={primary} onClick={open}>
          {plan ? "Edit income & reserves" : "Set monthly income"}
        </button>
      </div>
      <p className="mt-4 text-xs">
        Income actually recorded this month:{" "}
        <strong>{money(actualIncome)}</strong>. Expected income is your
        allocation ceiling, not money already available to spend.
      </p>
      {plan && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
            {[
              [
                "household",
                "Household essentials",
                "Uses your annual rent and household size to draft a monthly plan.",
              ],
              [
                "flexible",
                "Flexible starter",
                "An editable starting split for everyday costs and reserves.",
              ],
            ].map(([key, title, description]) => (
              <div
                key={key}
                className="rounded-xl border border-sky-100 bg-sky-50/40 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-sm">{title}</h4>
                  {recommended === key && (
                    <span className="rounded-full bg-sky-100 px-2 py-1 text-[10px] text-sky-800">
                      Suggested for your profile
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500">{description}</p>
                <button className="mt-4" onClick={() => suggest(key)}>
                  Preview template
                </button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Suggestions use your inputs, not local price estimates. Review every
            amount. Annual rent is divided by 12; budget limits are not savings
            transfers.
          </p>
        </>
      )}
      {error && !editing && !preview && (
        <p role="alert" className="mt-3 text-red-600 text-sm">
          {error}
        </p>
      )}
      {editing && (
        <Dialog
          title="Monthly income & reserves"
          onClose={() => setEditing(false)}
          busy={busy}
        >
          <form onSubmit={save} className="space-y-4">
            {[
              ["income", "Take-home income this month (NGN)"],
              ["savings", "Savings allocation (NGN)"],
              ["emergency", "Emergency fund allocation (NGN)"],
              ["annual_rent", "Annual rent (NGN, 0 if none)"],
              ["household_size", "People in your household"],
            ].map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  className={field}
                  required
                  type="number"
                  step={key === "household_size" ? "1" : "0.01"}
                  min={
                    key === "income"
                      ? "0.01"
                      : key === "household_size"
                        ? "1"
                        : "0"
                  }
                  max={key === "household_size" ? "30" : "9999999999.99"}
                  value={draft[key]}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      [key]:
                        key === "household_size"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              </Field>
            ))}
            <p className="text-xs">
              Savings and emergency reserves count against income but are not
              recorded as spending. Rent affects template suggestions; applying
              a template adds its category limits.
            </p>
            {error && (
              <p role="alert" className="text-red-600 text-sm">
                {error}
              </p>
            )}
            <button disabled={busy} className={primary}>
              {busy ? "Saving…" : "Save income plan"}
            </button>
          </form>
        </Dialog>
      )}
      {preview && (
        <Dialog
          title="Review your suggested budget"
          onClose={() => setPreview(null)}
          busy={busy}
        >
          <p className="mb-4 text-xs">
            Applying replaces this month’s category budgets and reserves.
            Existing transactions remain. Edit the suggested amounts first.
          </p>
          <div className="space-y-3">
            {preview.allocations.map((line, index) => (
              <Field key={line.name} label={line.name}>
                <input
                  className={field}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={line.amount}
                  onChange={(e) =>
                    setPreview({
                      ...preview,
                      allocations: preview.allocations.map((r, i) =>
                        i === index ? { ...r, amount: e.target.value } : r,
                      ),
                    })
                  }
                />
              </Field>
            ))}
            {[
              ["savings", "Savings"],
              ["emergency", "Emergency fund"],
            ].map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  className={field}
                  type="number"
                  min="0"
                  step="0.01"
                  value={preview[key]}
                  onChange={(e) =>
                    setPreview({ ...preview, [key]: e.target.value })
                  }
                />
              </Field>
            ))}
          </div>
          <p className="my-4 text-sm">
            Income {money(preview.income)} · Allocated{" "}
            {money(allocationSummary(preview, preview.allocations).allocated)} ·
            Unallocated{" "}
            {money(allocationSummary(preview, preview.allocations).left)}
          </p>
          {error && (
            <p role="alert" className="my-3 text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            className={primary}
            disabled={
              busy ||
              allocationSummary(preview, preview.allocations).left < 0 ||
              preview.allocations.some(
                (r) =>
                  !Number.isFinite(Number(r.amount)) || Number(r.amount) <= 0,
              )
            }
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await onApply(preview);
                setPreview(null);
              } catch (err) {
                setError(err.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Applying…" : "Apply this monthly plan"}
          </button>
        </Dialog>
      )}
    </section>
  );
}
