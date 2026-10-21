// Monthly reducing-balance estimates, rounded to cents at each interest charge.
export function projectRepayment(
  debts,
  monthlyPayment,
  strategy = "avalanche",
) {
  const payment = Math.round(Number(monthlyPayment) * 100);
  if (!Number.isSafeInteger(payment) || payment <= 0)
    return { error: "Enter a monthly payment greater than zero." };
  const rows = debts
    .filter((d) => Number(d.balance) > 0)
    .map((d) => ({
      ...d,
      cents: Math.round(Number(d.balance) * 100),
      rate: Number(d.apr) / 1200,
      minimum: Math.round(Number(d.minimum_payment) * 100),
    }));
  if (!rows.length) return { months: 0, interest: 0, total: 0, schedule: [] };
  if (
    rows.some(
      (d) =>
        !Number.isFinite(d.rate) ||
        d.rate < 0 ||
        !Number.isSafeInteger(d.cents) ||
        !Number.isSafeInteger(d.minimum),
    )
  )
    return { error: "Check every debt balance, APR and minimum payment." };
  if (payment < rows.reduce((s, d) => s + Math.min(d.minimum, d.cents), 0))
    return { error: "This amount is below your combined minimum payments." };
  let total = 0,
    interest = 0;
  const schedule = [];
  for (let month = 1; month <= 600; month++) {
    const opening = rows.reduce((s, d) => s + d.cents, 0);
    for (const d of rows) {
      const charge = Math.round(d.cents * d.rate);
      interest += charge;
      d.cents += charge;
    }
    let available = payment;
    for (const d of rows) {
      const paid = Math.min(available, d.minimum, d.cents);
      d.cents -= paid;
      available -= paid;
      total += paid;
    }
    rows.sort((a, b) =>
      strategy === "snowball"
        ? a.cents - b.cents || b.rate - a.rate
        : b.rate - a.rate || a.cents - b.cents,
    );
    for (const d of rows) {
      const paid = Math.min(available, d.cents);
      d.cents -= paid;
      available -= paid;
      total += paid;
    }
    const remaining = rows.reduce((s, d) => s + d.cents, 0);
    schedule.push({ month, remaining: remaining / 100 });
    if (!remaining)
      return {
        months: month,
        interest: interest / 100,
        total: total / 100,
        schedule,
      };
    if (remaining >= opening)
      return {
        error:
          "This payment does not reduce your combined debt after interest. Increase it or review the terms with your lenders.",
      };
  }
  return {
    error:
      "This plan takes more than 50 years. Increase the payment to see a practical estimate.",
  };
}
