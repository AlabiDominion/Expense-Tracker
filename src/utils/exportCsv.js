export function downloadCsv(rows, categories, month) {
  const safe = (v) =>
    '"' +
    String(v)
      .replace(/^[=+@\-\t\r]/, "'$&")
      .replaceAll('"', '""') +
    '"';
  const csv = [
    ["Date", "Description", "Type", "Category", "Amount (NGN)"],
    ...rows.map((t) => [
      t.transaction_date,
      t.description,
      t.type,
      categories.find((c) => c.id === t.category_id)?.name || "",
      t.amount,
    ]),
  ]
    .map((r) => r.map(safe).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `cloudberth-expenses-${month}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
