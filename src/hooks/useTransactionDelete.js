import { useState } from "react";

export function useTransactionDelete({ deleteTransaction, notify }) {
  const [transaction, setTransaction] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function requestDelete(row) {
    setError("");
    setTransaction(row);
  }

  function cancel() {
    if (!busy) setTransaction(null);
  }

  async function confirm() {
    if (!transaction || busy) return;
    setBusy(true);
    setError("");
    try {
      await deleteTransaction(transaction.id);
      setTransaction(null);
      notify("Transaction deleted");
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return { transaction, busy, error, requestDelete, cancel, confirm };
}
