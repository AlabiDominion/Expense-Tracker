import StatementUpload from "./StatementUpload";
import StatementReview from "./StatementReview";
import { useEffect, useRef } from "react";
import { useStatementImport } from "../../hooks/useStatementImport";

export default function StatementImportDialog({
  categories,
  onClose,
  onImported,
}) {
  const dialog = useRef(null);

  const importer = useStatementImport(onImported);
  const { preview, rows, busy, error, result } = importer;
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  const primary =
    "rounded-lg border-[#087dbd] bg-[#087dbd] px-4 py-[10px] text-white hover:bg-[#06689e]";
  return (
    <dialog
      ref={dialog}
      className="m-auto max-h-[90dvh] w-[min(1100px,calc(100vw-32px))] overflow-auto rounded-2xl border border-[#e2e8e2] bg-[#f7f9f6] p-0 text-[#183247] shadow-2xl backdrop:bg-[#071b2a88] backdrop:backdrop-blur-[3px]"
      aria-labelledby="statement-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#e2e8e2] bg-white px-6 py-5">
        <div>
          <span className="text-[9px] font-semibold tracking-[2px] text-[#7d94a5]">
            SMART STATEMENT IMPORT
          </span>
          <h2 id="statement-title" className="mt-2 text-[23px]">
            {result
              ? "Import complete"
              : preview
                ? "Review your transactions"
                : "Less typing. More clarity."}
          </h2>
          <p className="mt-2 text-[11px]">
            {preview
              ? `${preview.bank} · ${preview.pages} pages · ${rows.length} extracted transactions`
              : "Upload a Moniepoint statement and turn it into organized transactions."}
          </p>
        </div>
        <button
          disabled={busy}
          onClick={onClose}
          aria-label="Close statement import"
          className="border-0 px-2 py-0 text-2xl"
        >
          ×
        </button>
      </div>
      <div className="p-6">
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700"
          >
            {error}
          </div>
        )}
        {result ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
              ✓
            </div>
            <h3>{result.imported} transactions added</h3>
            <p className="mt-3 text-xs">
              {result.skipped} previously imported entries skipped. Your charts
              and monthly reports have been refreshed.
            </p>
            <button className={`${primary} mt-7`} onClick={onClose}>
              View transactions
            </button>
          </div>
        ) : !preview ? (
          <StatementUpload busy={busy} onUpload={importer.upload} />
        ) : (
          <StatementReview
            importer={importer}
            categories={categories}
            onClose={onClose}
          />
        )}
      </div>
    </dialog>
  );
}
