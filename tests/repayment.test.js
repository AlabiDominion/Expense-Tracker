import test from "node:test";
import assert from "node:assert/strict";
import { projectRepayment } from "../src/utils/repayment.js";
const debt = (balance, apr = 0, minimum_payment = 0) => ({
  balance,
  apr,
  minimum_payment,
});
test("interest-free debt rounds final payment and exact payoff months", () => {
  assert.equal(projectRepayment([debt(300000)], 25000).months, 12);
  const result = projectRepayment([debt(100.01)], 50);
  assert.equal(result.months, 3);
  assert.equal(result.total, 100.01);
  assert.equal(result.interest, 0);
  assert.equal(result.schedule.at(-1).remaining, 0);
});
test("interest compounds monthly in cents and payment must reduce balance", () => {
  const result = projectRepayment([debt(1000, 12)], 100);
  assert.equal(result.months, 11);
  assert.ok(result.interest > 0);
  assert.equal(result.total, 1000 + result.interest);
  assert.match(projectRepayment([debt(1000, 12)], 10).error, /does not reduce/);
  assert.ok(projectRepayment([debt(1000, 12, 100)], 99).error);
  assert.ok(projectRepayment([debt(100)], 0).error);
});
test("strategy keeps minimums, rolls payments and does not mutate debts", () => {
  const rows = [debt(200, 0, 10), debt(1000, 24, 50)];
  const original = JSON.stringify(rows);
  const avalanche = projectRepayment(rows, 150, "avalanche");
  const snowball = projectRepayment(rows, 150, "snowball");
  assert.ok(avalanche.interest < snowball.interest);
  assert.equal(JSON.stringify(rows), original);
  assert.equal(projectRepayment([], 100).months, 0);
});
