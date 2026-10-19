export const defaultCategories = [
  { id: 1, name: "Salary", type: "income", color: "#188c68", icon: "↗" },
  { id: 2, name: "Freelance", type: "income", color: "#4785d6", icon: "⌘" },
  {
    id: 3,
    name: "Food & dining",
    type: "expense",
    color: "#e9a24b",
    icon: "♨",
  },
  { id: 4, name: "Shopping", type: "expense", color: "#9b83cf", icon: "◇" },
  { id: 5, name: "Transport", type: "expense", color: "#5c9fba", icon: "↔" },
  {
    id: 6,
    name: "Bills & utilities",
    type: "expense",
    color: "#dc7d7e",
    icon: "⌂",
  },
  {
    id: 7,
    name: "Entertainment",
    type: "expense",
    color: "#86a878",
    icon: "♫",
  },
];
export function seedTransactions() {
  const rows = [];
  for (let offset = 5; offset >= 0; offset--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - offset);
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entries = [
      ["Monthly salary", 1, 650000, 1],
      ["Website design project", 2, 125000 + offset * 7000, 8],
      ["Weekly groceries", 3, 32500 + offset * 1100, 3],
      ["Electricity bill", 6, 24000, 5],
      ["Ride to the office", 5, 8500, 7],
      ["New headphones", 4, 45000, 10],
      ["Lunch with the team", 3, 18200, 12],
      ["Internet subscription", 6, 25000, 14],
      ["Movie night", 7, 12000, 16],
      ["Market essentials", 3, 28500, 18],
      ["Fuel refill", 5, 30000, 19],
    ];
    entries.forEach(([description, category_id, amount, day]) =>
      rows.push({
        id: rows.length + 1,
        description,
        category_id,
        amount: String(amount),
        type: category_id < 3 ? "income" : "expense",
        transaction_date: `${prefix}-${String(day).padStart(2, "0")}`,
      }),
    );
  }
  return rows;
}
