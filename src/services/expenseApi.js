import { request } from "./http";

// Keep endpoint URLs and transport details out of React components.
export const expenseApi = {
  load: () => Promise.all([request("/transactions"), request("/categories")]),
  saveTransaction: (transaction) =>
    request(
      transaction.id ? `/transactions/${transaction.id}` : "/transactions",
      {
        method: transaction.id ? "PUT" : "POST",
        body: JSON.stringify(transaction),
      },
    ),
  deleteTransaction: (id) =>
    request(`/transactions/${id}`, { method: "DELETE" }),
  deleteCategory: (id, replacementId) =>
    request(
      `/categories/${id}${replacementId ? `?replacement_id=${replacementId}` : ""}`,
      { method: "DELETE" },
    ),
  addCategory: (category) =>
    request("/categories", { method: "POST", body: JSON.stringify(category) }),
};
