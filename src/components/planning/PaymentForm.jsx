import { useState } from "react";
import { money } from "../../utils/format";
import { Dialog, Field, field, primary } from "./PlanningUI";
export default function PaymentForm({
  debt,
  transactions,
  payments,
  onClose,
  onSave,
}) {
  const [transactionId, setTransactionId] = useState(""),
    [principal, setPrincipal] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Lagos",
  });
  const options = transactions.filter(
    (t) =>
      t.type === "expense" &&
      t.transaction_date <= today &&
      !payments.some((p) => p.transaction_id === t.id),
  );
  const transaction = options.find((t) => t.id === Number(transactionId));
  return (
    <Dialog
      title={`Record payment · ${debt.name}`}
      busy={busy}
      onClose={onClose}
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            if (
              !transaction ||
              Number(principal) > Number(transaction.amount) ||
              Number(principal) > Number(debt.balance)
            )
              throw new Error(
                "Principal cannot exceed the expense amount or outstanding balance.",
              );
            await onSave({ transaction_id: transaction.id, principal });
            onClose();
          } catch (err) {
            setError(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-sm">
          Choose an expense you have already recorded or imported. We link it to
          this debt without creating another expense.
        </p>
        <Field label="Existing repayment expense">
          <select
            className={field}
            required
            value={transactionId}
            onChange={(e) => {
              setTransactionId(e.target.value);
              setPrincipal("");
            }}
          >
            <option value="">Choose expense</option>
            {options.map((t) => (
              <option key={t.id} value={t.id}>
                {t.transaction_date} · {t.description} · {money(t.amount)}
              </option>
            ))}
          </select>
        </Field>
        {!options.length && (
          <p className="text-xs">
            Record the payment in Transactions first, then return here.
          </p>
        )}
        <Field label="Amount reducing principal (NGN)">
          <input
            required
            className={field}
            type="number"
            min="0.01"
            max={Math.min(
              Number(debt.balance),
              Number(transaction?.amount || debt.balance),
            )}
            step="0.01"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </Field>
        {transaction && (
          <p className="text-xs">
            Interest / fees included in this expense:{" "}
            {money(Math.max(0, Number(transaction.amount) - Number(principal)))}
            . Check the split with your lender. Update the next due date after
            payment.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button disabled={busy || !options.length} className={primary}>
          {busy ? "Saving…" : "Link repayment"}
        </button>
      </form>
    </Dialog>
  );
}
