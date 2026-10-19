import { useState } from "react";

export function useTransactionForm({
  categories,
  month,
  saveTransaction,
  notify,
}) {
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function openForm(transaction) {
    setError("");
    setForm(
      transaction
        ? { ...transaction }
        : {
            description: "",
            amount: "",
            type: "expense",
            category_id: categories.find((c) => c.type === "expense")?.id || "",
            transaction_date: `${month}-01`,
          },
    );
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (!form.description.trim())
        throw new Error("Please enter a description");
      await saveTransaction({
        ...form,
        description: form.description.trim(),
        category_id: Number(form.category_id),
        amount: String(form.amount),
      });
      setForm(null);
      notify("Transaction saved");
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return { form, setForm, busy, error, openForm, submit };
}
