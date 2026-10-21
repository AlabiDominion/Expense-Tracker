import { useEffect, useRef } from "react";
import { money } from "../../utils/format";
export default function DeleteTransactionDialog({
  transaction,
  busy,
  error,
  onCancel,
  onConfirm,
}) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="m-auto max-h-[calc(100dvh-40px)] w-[min(440px,calc(100vw-32px))] overflow-auto rounded-2xl border border-[#e2e8e2] bg-white p-0 text-[#183247] shadow-[0_24px_90px_#12302030] backdrop:bg-[#071b2a88] backdrop:backdrop-blur-[3px]"
      aria-labelledby="delete-title"
      aria-describedby="delete-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div className="p-[26px] [&>p]:text-xs [&>p]:leading-[1.8] max-[420px]:p-5">
        <div className="mb-3 flex items-center justify-between gap-4 [&_h2]:text-[22px] [&_h2]:tracking-[-.5px]">
          <h2 id="delete-title">Delete transaction?</h2>
          <button
            type="button"
            className="border-0 px-[7px] py-[2px] text-[23px] text-[#8b998e]"
            aria-label="Close confirmation"
            disabled={busy}
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        <p id="delete-description">
          This transaction will be removed from your records and reports. This
          action cannot be undone.
        </p>
        <div className="mt-5 mb-6 flex items-center justify-between gap-[15px] rounded-[9px] border border-[#edf1e9] bg-[#f6f8f5] p-4 text-xs [&_strong]:wrap-anywhere [&_span]:shrink-0 [&_span]:text-[#718475]">
          <strong>{transaction.description}</strong>
          <span>{money(transaction.amount)}</span>
        </div>
        {error && (
          <p className="bg-[#fff1ef] p-[10px] text-[#b4544e]" role="alert">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-[10px] max-[420px]:flex-wrap">
          <button type="button" autoFocus disabled={busy} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="border-[#bd5353] bg-[#bd5353] text-white hover:border-[#a34343] hover:bg-[#a34343]"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Deleting…" : "Delete transaction"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
