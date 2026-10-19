import { useState } from "react";
import { money } from "../../utils/format";
import { sumAmounts } from "../../utils/reports";
import StatementReviewTable from "./StatementReviewTable";
export default function StatementReview({ importer, categories, onClose }) {
  const [page, setPage] = useState(0);
  const { rows, preview, busy } = importer;
  const selected = rows.filter((row) => row.selected && !row.duplicate);
  const pages = Math.ceil(rows.length / 20);
  const primary = "border-[#248461] bg-[#248461] text-white hover:bg-[#1a6f50]";
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <strong className="block break-all text-xs">
            {importer.filename}
          </strong>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-[10px] ${preview.reconciled ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
          >
            {preview.reconciled
              ? "✓ Extracted totals match the statement"
              : "Review needed: totals differ"}
          </span>
        </div>
        <button
          disabled={busy}
          onClick={() => {
            importer.reset();
            setPage(0);
          }}
          className="text-xs"
        >
          Choose another PDF
        </button>
      </div>
      <div className="mb-5 grid grid-cols-4 gap-3 max-[600px]:grid-cols-2">
        {[
          ["Selected", selected.length],
          [
            "Selected income",
            money(sumAmounts(selected.filter((r) => r.type === "income"))),
          ],
          [
            "Selected expenses",
            money(sumAmounts(selected.filter((r) => r.type === "expense"))),
          ],
          [
            "Duplicates flagged",
            rows.filter((r) => r.duplicate || r.possible_duplicate).length,
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-[#e2e8e2] bg-white p-4"
          >
            <span className="text-[10px] text-[#849088]">{label}</span>
            <strong className="mt-2 block text-base">{value}</strong>
          </div>
        ))}
      </div>
      {preview.warnings.map((warning) => (
        <p
          key={warning}
          className="mb-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800"
        >
          {warning}
        </p>
      ))}
      <p className="mb-4 text-[11px]">
        Credits are bank inflows, not necessarily earned income. Review
        transfers, exclude entries you do not want, and adjust suggested
        categories. Uncategorized entries can be organized later.
      </p>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[11px] text-[#849088]">
          Known duplicates cannot be selected; possible matches start unchecked.
        </span>
        <div className="flex shrink-0 gap-2">
          <button
            disabled={busy}
            className="px-3 py-2 text-[10px]"
            onClick={() => importer.selectAll(true)}
          >
            Select new entries
          </button>
          <button
            disabled={busy}
            className="px-3 py-2 text-[10px]"
            onClick={() => importer.selectAll(false)}
          >
            Clear selection
          </button>
        </div>
      </div>
      <StatementReviewTable
        rows={rows}
        categories={categories}
        page={page}
        busy={busy}
        onUpdate={importer.update}
      />
      <div className="mt-4 flex items-center justify-between text-[11px]">
        <span className="text-[#849088]">
          Page {page + 1} of {pages} · {rows.length} entries
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 0 || busy}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-2 text-[11px]"
          >
            Previous
          </button>
          <button
            disabled={page + 1 >= pages || busy}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-2 text-[11px]"
          >
            Next
          </button>
        </div>
      </div>
      <div className="mt-6 border-t border-[#dce4de] pt-5">
        <label className="flex items-center gap-3 text-xs text-[#64796b]">
          <input
            className="size-4 accent-[#248461]"
            type="checkbox"
            checked={importer.acknowledged}
            disabled={busy}
            onChange={(e) => importer.setAcknowledged(e.target.checked)}
          />
          I have reviewed the selected entries and want to save them to my live
          database.
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <button disabled={busy} onClick={onClose}>
            Cancel
          </button>
          <button
            className={primary}
            disabled={busy || !selected.length || !importer.acknowledged}
            onClick={importer.confirm}
          >
            {busy ? "Importing…" : `Import ${selected.length} transactions`}
          </button>
        </div>
      </div>
    </>
  );
}
