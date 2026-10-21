const cents = (value) => Math.round(Number(value) * 100);
export function allocationSummary(plan, budgets) {
  const expenses = budgets.reduce((n, b) => n + cents(b.amount), 0);
  const reserves = cents(plan?.savings || 0) + cents(plan?.emergency || 0);
  return {
    expenses: expenses / 100,
    reserves: reserves / 100,
    allocated: (expenses + reserves) / 100,
    left: (cents(plan?.income || 0) - expenses - reserves) / 100,
  };
}
export function recommendTemplate(plan) {
  return Number(plan.annual_rent) > 0 || Number(plan.household_size) > 1
    ? "household"
    : "flexible";
}
export function buildBudgetTemplate(plan, kind) {
  const income = cents(plan.income);
  if (!Number.isSafeInteger(income) || income <= 0)
    throw new Error("Enter your monthly income first.");
  // Editable planning examples, not inferred costs or automatic transactions.
  let savings, emergency, lines;
  if (kind === "household") {
    const rent = Math.round(cents(plan.annual_rent) / 12);
    if (rent >= income)
      throw new Error(
        "Monthly rent alone uses all your income. Enter custom allocations instead.",
      );
    // The supplied household example: NGN400k income, NGN1m annual rent, 2 people.
    // Keep a 5% unallocated buffer and distribute the amount remaining after rent.
    const available = Math.round(income * 0.95) - rent;
    if (available <= 0)
      throw new Error(
        "Rent leaves no room for this template. Try a custom plan.",
      );
    const foodWeight =
      105000 * Math.max(0.5, Math.min(Number(plan.household_size) / 2, 3));
    const weights = [
      ["Food & dining", foodWeight],
      ["Transport", 35000],
      ["Utilities", 20000],
      ["Data", 20000],
      ["Personal care", 18000],
      ["Savings", 45000],
      ["Emergency fund", 20000],
      ["Miscellaneous", 21666.67],
      ["Health", 12000],
    ];
    const total = weights.reduce((n, [, w]) => n + w, 0);
    let assigned = 0;
    const amounts = weights.map(([name, w], i) => {
      const value =
        i === weights.length - 1
          ? available - assigned
          : Math.floor((available * w) / total);
      assigned += value;
      return { name, amount: value };
    });
    savings = amounts.find((r) => r.name === "Savings").amount;
    emergency = amounts.find((r) => r.name === "Emergency fund").amount;
    lines = [
      ...(rent > 0 ? [{ name: "Rent", amount: rent }] : []),
      ...amounts.filter((r) => !["Savings", "Emergency fund"].includes(r.name)),
    ];
  } else {
    savings = Math.floor(income * 0.15);
    emergency = Math.floor(income * 0.05);
    lines = [
      ["Food & dining", 0.25],
      ["Bills & utilities", 0.2],
      ["Transport", 0.1],
      ["Personal care", 0.1],
      ["Entertainment", 0.1],
    ].map(([name, ratio]) => ({ name, amount: Math.floor(income * ratio) }));
  }
  return {
    ...plan,
    savings: (savings / 100).toFixed(2),
    emergency: (emergency / 100).toFixed(2),
    allocations: lines
      .filter((r) => r.amount > 0)
      .map((r) => ({ ...r, amount: (r.amount / 100).toFixed(2) })),
  };
}
