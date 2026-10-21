import test from "node:test";
import assert from "node:assert/strict";
import {
  allocationSummary,
  buildBudgetTemplate,
  recommendTemplate,
} from "../src/utils/budgetPlan.js";
const plan = {
  month: "2026-10",
  income: "400000",
  savings: "0",
  emergency: "0",
  annual_rent: "1000000",
  household_size: 2,
};
test("household example allocates 380k and leaves 20k with annual rent divided by 12", () => {
  const suggestion = buildBudgetTemplate(plan, "household");
  assert.equal(
    suggestion.allocations.find((r) => r.name === "Rent").amount,
    "83333.33",
  );
  assert.equal(
    allocationSummary(suggestion, suggestion.allocations).allocated,
    380000,
  );
  assert.equal(
    allocationSummary(suggestion, suggestion.allocations).left,
    20000,
  );
  assert.equal(recommendTemplate(plan), "household");
});
test("reserves count once and cents stay exact", () => {
  const summary = allocationSummary(
    { ...plan, income: 1, savings: 0.1, emergency: 0.2 },
    [{ amount: 0.3 }],
  );
  assert.equal(summary.allocated, 0.6);
  assert.equal(summary.left, 0.4);
  assert.equal(
    allocationSummary({ ...plan, income: 1 }, [{ amount: 2 }]).left,
    -1,
  );
});
test("suggestions change by household size and reject unaffordable rent", () => {
  assert.equal(
    recommendTemplate({ ...plan, annual_rent: 0, household_size: 1 }),
    "flexible",
  );
  assert.throws(() =>
    buildBudgetTemplate({ ...plan, income: 10 }, "household"),
  );
  const a = buildBudgetTemplate(plan, "household");
  const b = buildBudgetTemplate({ ...plan, household_size: 4 }, "household");
  assert.ok(
    Number(b.allocations.find((r) => r.name === "Food & dining").amount) >
      Number(a.allocations.find((r) => r.name === "Food & dining").amount),
  );
  assert.ok(allocationSummary(b, b.allocations).left >= 0);
});
