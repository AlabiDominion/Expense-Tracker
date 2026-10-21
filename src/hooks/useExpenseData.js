import { useEffect, useState } from "react";
import { defaultCategories, seedTransactions } from "../data/demoData";
import { expenseApi } from "../services/expenseApi";
import { readStoredData, saveStoredData } from "../services/storage";

// Live MySQL data and presentation fixtures always use separate storage.
export function useExpenseData({ demo = false, planning } = {}) {
  const workspace = demo ? "demo" : "live";
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [mode, setMode] = useState("Connecting");
  const [connectionError, setConnectionError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const load =
      workspace === "demo"
        ? Promise.resolve([
            readStoredData("transactions", seedTransactions),
            readStoredData("categories", () => defaultCategories),
          ])
        : expenseApi.load();
    load
      .then(([rows, groups]) => {
        if (!active) return;
        setTransactions(rows);
        setCategories(groups);
        setConnectionError("");
        setMode(workspace === "demo" ? "Local demo" : "MySQL API");
      })
      .catch(() => {
        if (!active) return;
        setConnectionError(
          "Cannot connect to your database API. Start the backend and check its MySQL configuration, then retry.",
        );
        setMode("Offline");
      });
    return () => {
      active = false;
    };
  }, [workspace, attempt]);

  useEffect(() => {
    if (mode !== "Local demo") return;
    saveStoredData("transactions", transactions);
    saveStoredData("categories", categories);
  }, [transactions, categories, mode]);

  function retryConnection() {
    setMode("Connecting");
    setConnectionError("");
    setAttempt((value) => value + 1);
  }

  function assertWritable() {
    if (mode !== "MySQL API" && mode !== "Local demo")
      throw new Error(
        "Your workspace is not connected. Please retry before making changes.",
      );
  }

  async function saveTransaction(transaction) {
    assertWritable();
    if (planning?.payments.some((p) => p.transaction_id === transaction.id))
      throw new Error(
        "Unlink this expense from its debt repayment before editing it.",
      );
    const saved =
      mode === "MySQL API"
        ? await expenseApi.saveTransaction(transaction)
        : { ...transaction, id: transaction.id ?? Date.now() };
    setTransactions((rows) =>
      transaction.id
        ? rows.map((row) => (row.id === saved.id ? saved : row))
        : [...rows, saved],
    );
  }

  async function deleteTransaction(id) {
    assertWritable();
    if (planning?.payments.some((p) => p.transaction_id === id))
      throw new Error(
        "Unlink this expense from its debt repayment before deleting it.",
      );
    if (mode === "MySQL API") await expenseApi.deleteTransaction(id);
    setTransactions((rows) => rows.filter((row) => row.id !== id));
  }

  async function addCategory(category) {
    assertWritable();
    if (!category.name.trim()) throw new Error("Please enter a category name");
    if (
      categories.some(
        (c) =>
          c.name.toLowerCase() === category.name.toLowerCase() &&
          c.type === category.type,
      )
    )
      throw new Error("This category already exists");
    const saved =
      mode === "MySQL API"
        ? await expenseApi.addCategory(category)
        : { ...category, id: Date.now() };
    setCategories((rows) => [...rows, saved]);
  }

  async function deleteCategory(id, replacementId) {
    assertWritable();
    if (planning?.budgets.some((b) => b.category_id === id))
      throw new Error(
        "Remove this category’s budgets before deleting the category.",
      );
    const category = categories.find((row) => row.id === id);
    const used = transactions.some((row) => row.category_id === id);
    const replacement = categories.find(
      (row) => row.id === Number(replacementId),
    );
    if (
      used &&
      (!replacement ||
        replacement.id === id ||
        replacement.type !== category?.type)
    ) {
      throw new Error(
        "Choose another category of the same type for existing transactions.",
      );
    }
    if (mode === "MySQL API")
      await expenseApi.deleteCategory(id, replacementId);
    setTransactions((rows) =>
      rows.map((row) =>
        row.category_id === id
          ? { ...row, category_id: Number(replacementId) }
          : row,
      ),
    );
    setCategories((rows) => rows.filter((row) => row.id !== id));
  }

  async function refreshData() {
    const [rows, groups] = demo
      ? [
          readStoredData("transactions", seedTransactions),
          readStoredData("categories", () => defaultCategories),
        ]
      : await expenseApi.load();
    setTransactions(rows);
    setCategories(groups);
  }

  return {
    refreshData,
    categories,
    transactions,
    mode,
    workspace,
    connectionError,
    retryConnection,
    saveTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
  };
}
