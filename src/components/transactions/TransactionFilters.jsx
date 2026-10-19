export default function TransactionFilters({
  categories,
  search,
  setSearch,
  type,
  setType,
  category,
  setCategory,
}) {
  return (
    <div className="flex gap-3 px-6 pb-5 [&_input]:flex-1 [&_input]:text-[11px] [&_select]:text-[11px] max-[780px]:flex-wrap max-[780px]:px-[15px] max-[780px]:pb-[15px] max-[780px]:[&_input]:w-full max-[780px]:[&_input]:flex-auto">
      <input
        placeholder="Search transactions…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        aria-label="Filter transaction type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expenses</option>
      </select>
      <select
        aria-label="Filter category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
