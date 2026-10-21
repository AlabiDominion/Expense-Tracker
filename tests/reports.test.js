import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMonthlyReport,
  filterTransactions,
  sumAmounts,
} from "../src/utils/reports.js";

const categories = [
  { id: 1, name: "Food", type: "expense" },
  { id: 2, name: "Salary", type: "income" },
];
const rows = [
  {
    id: 1,
    description: "Coffee",
    type: "expense",
    category_id: 1,
    amount: "0.10",
    transaction_date: "2026-02-01",
  },
  {
    id: 2,
    description: "Lunch",
    type: "expense",
    category_id: 1,
    amount: "0.20",
    transaction_date: "2026-02-28",
  },
  {
    id: 3,
    description: "Salary",
    type: "income",
    category_id: 2,
    amount: "100.00",
    transaction_date: "2026-02-20",
  },
  {
    id: 4,
    description: "Next month",
    type: "expense",
    category_id: 1,
    amount: "99.99",
    transaction_date: "2026-03-01",
  },
];

test("monthly report preserves cents and excludes adjacent months", () => {
  const report = buildMonthlyReport(rows, categories, "2026-02");
  assert.equal(report.expense, 0.3);
  assert.equal(report.income, 100);
  assert.equal(report.breakdown[0].total, 0.3);
  assert.deepEqual(
    report.monthly.map((t) => t.id),
    [2, 3, 1],
  );
  assert.equal(report.history.length, 6);
  assert.deepEqual(report.history[5], {
    label: "Feb",
    income: 100,
    expense: 0.3,
  });
  assert.equal(report.history[0].income, 0);
  assert.equal(sumAmounts(rows.slice(0, 2)), 0.3);
});

test("search, type and category filters compose without changing input", () => {
  assert.deepEqual(
    filterTransactions(rows, {
      search: "COF",
      type: "expense",
      category: "1",
    }).map((t) => t.id),
    [1],
  );
  assert.equal(
    filterTransactions(rows, { type: "income", category: "1" }).length,
    0,
  );
  assert.equal(rows.length, 4);
});

test("empty month produces zero totals and no category slices", () => {
  const report = buildMonthlyReport([], categories, "2026-02");
  assert.equal(report.income, 0);
  assert.equal(report.expense, 0);
  assert.deepEqual(report.breakdown, []);
  assert.ok(
    report.history.every((month) => month.income === 0 && month.expense === 0),
  );
});

test("total net carries history across years and empty months", () => {
  const previous = { ...rows[2], amount: "50.10", transaction_date: "2025-12-31" };
  const report = buildMonthlyReport([...rows, previous], categories, "2026-04", "2026-10-21");
  assert.equal(report.income, 0);
  assert.equal(report.expense, 0);
  assert.equal(report.totalNet, 49.81);
  assert.equal(report.balanceAsOf, "2026-04-30");
});

test("total net stops at selected month end or today and permits negative balances", () => {
  assert.equal(buildMonthlyReport(rows, categories, "2026-02", "2026-10-21").totalNet, 99.7);
  const current = buildMonthlyReport(rows, categories, "2026-02", "2026-02-10");
  assert.equal(current.totalNet, -0.1);
  assert.equal(current.balanceAsOf, "2026-02-10");
  assert.equal(buildMonthlyReport([], categories, "2026-02").totalNet, 0);
});
