// Work in integer cents while aggregating, then convert once for display.
export function sumAmounts(transactions) {
  return (
    transactions.reduce(
      (total, transaction) =>
        total + Math.round(Number(transaction.amount) * 100),
      0,
    ) / 100
  );
}

export function sortTransactions(transactions) {
  return [...transactions].sort(
    (a, b) =>
      b.transaction_date.localeCompare(a.transaction_date) || b.id - a.id,
  );
}

export function filterTransactions(
  transactions,
  { search = "", type = "all", category = "all" },
) {
  return transactions.filter(
    (transaction) =>
      (type === "all" || transaction.type === type) &&
      (category === "all" || String(transaction.category_id) === category) &&
      transaction.description.toLowerCase().includes(search.toLowerCase()),
  );
}

export function buildMonthlyReport(transactions, categories, month) {
  const monthly = sortTransactions(
    transactions.filter((t) => t.transaction_date.startsWith(month)),
  );
  const income = sumAmounts(monthly.filter((t) => t.type === "income"));
  const expense = sumAmounts(monthly.filter((t) => t.type === "expense"));
  const breakdown = categories
    .filter((c) => c.type === "expense")
    .map((category) => ({
      ...category,
      total: sumAmounts(monthly.filter((t) => t.category_id === category.id)),
    }))
    .filter((category) => category.total > 0)
    .sort((a, b) => b.total - a.total);
  const history = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(`${month}-01T12:00:00`);
    date.setMonth(date.getMonth() - 5 + index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const rows = transactions.filter((t) => t.transaction_date.startsWith(key));
    return {
      label: date.toLocaleDateString("en", { month: "short" }),
      income: sumAmounts(rows.filter((t) => t.type === "income")),
      expense: sumAmounts(rows.filter((t) => t.type === "expense")),
    };
  });
  return { monthly, income, expense, breakdown, history };
}
