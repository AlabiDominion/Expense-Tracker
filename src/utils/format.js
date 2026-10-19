export const money = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
export const monthLabel = (value) =>
  new Date(`${value}-01T12:00:00`).toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });
export const currentMonth = () =>
  `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
