import { useState } from "react";
import { Dialog, Field, field, primary } from "./PlanningUI";
export default function DebtForm({ debt, onClose, onSave }) {
  const [form, setForm] = useState(
      debt || {
        name: "",
        balance: "",
        apr: "",
        minimum_payment: "",
        due_date: "",
      },
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <Dialog
      title={debt ? "Edit debt" : "Add a debt"}
      onClose={onClose}
      busy={busy}
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const submitted = Object.fromEntries(new FormData(e.currentTarget));
            if (!submitted.name.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(submitted.due_date))
              throw new Error("Enter a debt name and a valid next payment date.");
            await onSave(submitted);
            onClose();
          } catch (err) {
            setError(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-xs text-slate-500">
          Enter the current principal balance. Adding a debt does not create
          income or change your recorded cash balance.
        </p>
        {[
          ["name", "Lender or debt name", "text"],
          ["balance", "Outstanding principal (NGN)", "number"],
          [
            "apr",
            "Fixed annual interest rate (APR %) — enter 0 only if interest-free",
            "number",
          ],
          ["minimum_payment", "Minimum monthly payment (NGN)", "number"],
          ["due_date", "Next payment due", "date"],
        ].map(([key, label, type]) => (
          <Field key={key} label={label}>
            <input
              className={field}
              required
              type={type}
              name={key}
              {...(type === "number"
                ? {
                    min: 0,
                    max: key === "apr" ? 1000 : 9999999999.99,
                    step: key === "apr" ? "0.001" : "0.01",
                  }
                : {})}
              maxLength={key === "name" ? 100 : undefined}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </Field>
        ))}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button disabled={busy} className={primary}>
          {busy ? "Saving…" : "Save debt"}
        </button>
      </form>
    </Dialog>
  );
}
