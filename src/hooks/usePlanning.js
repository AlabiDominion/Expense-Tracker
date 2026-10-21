import { useEffect, useState } from "react";
import { request } from "../services/http";
import { readStoredData, saveStoredData } from "../services/storage";
import { defaultCategories } from "../data/demoData";
import { allocationSummary } from "../utils/budgetPlan";

export function usePlanning(demo) {
  const [state, setState] = useState({
    budgets: [],
    debts: [],
    payments: [],
    plans: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const load = demo
      ? Promise.resolve(
          Object.fromEntries(
            ["budgets", "debts", "payments", "plans"].map((key) => [
              key,
              readStoredData("planning-" + key, () => []),
            ]),
          ),
        )
      : request("/planning");
    load
      .then((value) => {
        if (active) {
          setState(value);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [demo]);
  async function mutate(path, method, body) {
    if (loading || error)
      throw new Error("Planning is unavailable. Refresh and try again.");
    if (!demo) {
      await request(path, {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      setState(await request("/planning"));
      return;
    }
    const next = structuredClone(state),
      id = Date.now();
    const parts = path.split("/").filter(Boolean);
    if (["monthly-plan", "budget-template"].includes(parts[0])) {
      if (
        !Number.isFinite(Number(body.income)) ||
        Number(body.income) <= 0 ||
        ["savings", "emergency", "annual_rent"].some(
          (k) => !Number.isFinite(Number(body[k])) || Number(body[k]) < 0,
        )
      )
        throw new Error("Enter valid income and non-negative reserve amounts.");
      const replacing = parts[0] === "budget-template";
      if (
        replacing &&
        (body.allocations.some(
          (r) =>
            !r.name.trim() ||
            !Number.isFinite(Number(r.amount)) ||
            Number(r.amount) <= 0,
        ) ||
          new Set(body.allocations.map((r) => r.name.trim().toLowerCase()))
            .size !== body.allocations.length)
      )
        throw new Error("Check template amounts and category names.");
      const allocations = replacing
        ? body.allocations
        : next.budgets.filter((b) => b.month === body.month);
      if (allocationSummary(body, allocations).left < 0)
        throw new Error(
          "Allocations and reserves cannot exceed your planned income.",
        );
      const { allocations: templateLines, ...plan } = body;
      next.plans = [
        ...next.plans.filter((p) => p.month !== body.month),
        { ...plan, id },
      ];
      if (replacing) {
        const categories = readStoredData(
          "categories",
          () => defaultCategories,
        );
        const rows = templateLines.map((line, index) => {
          let category = categories.find(
            (c) =>
              c.type === "expense" &&
              c.name.toLowerCase() === line.name.trim().toLowerCase(),
          );
          if (!category) {
            category = {
              id: id + index + 1,
              name: line.name.trim(),
              type: "expense",
              color: "#087dbd",
              icon: "◇",
            };
            categories.push(category);
          }
          return {
            id: id + index + 100,
            month: body.month,
            category_id: category.id,
            amount: line.amount,
          };
        });
        next.budgets = [
          ...next.budgets.filter((b) => b.month !== body.month),
          ...rows,
        ];
        saveStoredData("categories", categories);
      }
    } else if (parts[0] === "budgets") {
      if (method === "DELETE")
        next.budgets = next.budgets.filter((r) => r.id !== Number(parts[1]));
      else {
        const plan = next.plans.find((p) => p.month === body.month);
        if (!plan) throw new Error("Set your planned monthly income first.");
        const proposed = [
          ...next.budgets.filter(
            (b) => b.month === body.month && b.category_id !== body.category_id,
          ),
          body,
        ];
        if (allocationSummary(plan, proposed).left < 0)
          throw new Error(
            "This allocation exceeds your planned monthly income.",
          );
        const existing = next.budgets.find(
          (r) => r.month === body.month && r.category_id === body.category_id,
        );
        if (existing) existing.amount = body.amount;
        else next.budgets.push({ ...body, id });
      }
    } else if (parts[0] === "debt-payments") {
      const p = next.payments.find((r) => r.id === Number(parts[1]));
      const debt = next.debts.find((r) => r.id === p.debt_id);
      debt.balance = (
        (Math.round(Number(debt.balance) * 100) +
          Math.round(Number(p.principal) * 100)) /
        100
      ).toFixed(2);
      next.payments = next.payments.filter((r) => r.id !== p.id);
    } else if (parts[2] === "payments") {
      const debt = next.debts.find((r) => r.id === Number(parts[1]));
      if (next.payments.some((r) => r.transaction_id === body.transaction_id))
        throw new Error("This expense is already linked.");
      if (Number(body.principal) > Number(debt.balance))
        throw new Error("Principal exceeds the outstanding balance.");
      debt.balance = (
        (Math.round(Number(debt.balance) * 100) -
          Math.round(Number(body.principal) * 100)) /
        100
      ).toFixed(2);
      next.payments.push({ ...body, id, debt_id: debt.id });
    } else if (method === "POST") next.debts.push({ ...body, id });
    else {
      if (
        next.payments.some((r) => r.debt_id === Number(parts[1])) &&
        (method === "DELETE" ||
          Number(body.balance) !==
            Number(next.debts.find((r) => r.id === Number(parts[1])).balance))
      )
        throw new Error(
          "Unlink repayments before deleting or correcting the balance.",
        );
      next.debts =
        method === "DELETE"
          ? next.debts.filter((r) => r.id !== Number(parts[1]))
          : next.debts.map((r) =>
              r.id === Number(parts[1]) ? { ...body, id: r.id } : r,
            );
    }
    for (const key of ["budgets", "debts", "payments", "plans"])
      saveStoredData("planning-" + key, next[key]);
    setState(next);
  }
  return { ...state, loading, error, mutate };
}
