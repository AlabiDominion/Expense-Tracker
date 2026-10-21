import { useState } from "react";
import { money } from "../utils/format";
import {
  panel,
  primary,
  Dialog,
  Status,
} from "../components/planning/PlanningUI";
import DebtForm from "../components/planning/DebtForm";
import PaymentForm from "../components/planning/PaymentForm";
import RepaymentPlanner from "../components/planning/RepaymentPlanner";
export default function DebtsPage({ planning, transactions }) {
  const [form, setForm] = useState(null),
    [paying, setPaying] = useState(null),
    [confirm, setConfirm] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const total =
    planning.debts.reduce(
      (n, d) => n + Math.round(Number(d.balance) * 100),
      0,
    ) / 100;
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Lagos",
  });
  if (planning.loading || planning.error) return <Status {...planning} />;
  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-[#0d2b42] p-6 text-white">
        <div>
          <p className="text-xs text-sky-200">ONE STEP CLOSER</p>
          <h2 className="mt-3 text-3xl">{money(total)}</h2>
          <p className="mt-2 text-xs text-sky-100">
            Outstanding principal across {planning.debts.length} debts · All
            planning features are free
          </p>
        </div>
        <button className={primary} onClick={() => setForm({})}>
          ＋ Add debt
        </button>
      </section>
      <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
        {!planning.debts.length && (
          <div className={`${panel} col-span-full`}>
            <h3>A clearer path to debt-free</h3>
            <p className="mt-2 text-sm">
              Add a loan, instalment or money borrowed from family. Track what
              remains and explore a realistic repayment plan.
            </p>
          </div>
        )}
        {planning.debts.map((d) => (
          <article className={panel} key={d.id}>
            <div className="flex justify-between gap-3">
              <h3>{d.name}</h3>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs text-[#087dbd]">
                {Number(d.balance) === 0 ? "Paid off" : `${d.apr}% APR`}
              </span>
            </div>
            <h2 className="mt-5 text-2xl">{money(d.balance)}</h2>
            <p className="mt-3 text-xs text-slate-500">
              Minimum {money(d.minimum_payment)} / month
            </p>
            <p
              className={`mt-2 text-xs ${d.due_date < today && Number(d.balance) > 0 ? "text-amber-700" : "text-slate-500"}`}
            >
              Next due {d.due_date}
              {d.due_date < today && Number(d.balance) > 0
                ? " · Past due date — check and update your records"
                : ""}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                disabled={Number(d.balance) === 0}
                onClick={() => setPaying(d)}
              >
                Record payment
              </button>
              <button onClick={() => setForm(d)}>Edit</button>
              <button
                onClick={() => {
                  setError("");
                  setConfirm({
                    path: "/debts/" + d.id,
                    title: "Remove debt?",
                    detail:
                      "This removes the debt record only. It does not cancel what you owe. Unlink any repayments first.",
                  });
                }}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
      <RepaymentPlanner debts={planning.debts} />
      <section className={panel}>
        <h3>Repayment history</h3>
        <p className="mt-2 text-xs text-slate-500">
          Linked expenses stay in Transactions. Unlinking restores principal
          without deleting the expense.
        </p>
        {!planning.payments.length && (
          <p className="mt-5 text-sm">No repayments linked yet.</p>
        )}
        <div className="mt-4 divide-y divide-slate-100">
          {planning.payments.map((p) => {
            const t = transactions.find((t) => t.id === p.transaction_id);
            return (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"
              >
                <div>
                  <strong>
                    {planning.debts.find((d) => d.id === p.debt_id)?.name}
                  </strong>
                  <p className="mt-1 text-xs text-slate-500">
                    {t?.transaction_date} · {t?.description} · Principal{" "}
                    {money(p.principal)} · Interest / fees{" "}
                    {money(
                      Number(t?.amount || p.principal) - Number(p.principal),
                    )}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setError("");
                    setConfirm({
                      path: "/debt-payments/" + p.id,
                      title: "Unlink repayment?",
                      detail:
                        "The principal will be added back to this debt. The expense record will remain.",
                    });
                  }}
                >
                  Unlink
                </button>
              </div>
            );
          })}
        </div>
      </section>
      {form && (
        <DebtForm
          debt={form.id ? form : null}
          onClose={() => setForm(null)}
          onSave={(body) =>
            planning.mutate(
              "/debts" + (form.id ? "/" + form.id : ""),
              form.id ? "PUT" : "POST",
              body,
            )
          }
        />
      )}{" "}
      {paying && (
        <PaymentForm
          debt={paying}
          transactions={transactions}
          payments={planning.payments}
          onClose={() => setPaying(null)}
          onSave={(body) =>
            planning.mutate("/debts/" + paying.id + "/payments", "POST", body)
          }
        />
      )}{" "}
      {confirm && (
        <Dialog
          title={confirm.title}
          busy={busy}
          onClose={() => setConfirm(null)}
        >
          <p className="mb-5 text-sm">{confirm.detail}</p>
          {error && (
            <p role="alert" className="mb-3 text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            className={primary}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await planning.mutate(confirm.path, "DELETE");
                setConfirm(null);
              } catch (e) {
                setError(e.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Saving…" : "Confirm"}
          </button>
        </Dialog>
      )}
    </div>
  );
}
