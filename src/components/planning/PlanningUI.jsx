import { useEffect, useRef } from "react";
export const panel = "rounded-2xl border border-[#dfe7ed] bg-white p-6";
export const primary =
  "rounded-lg border-0 bg-[#087dbd] px-4 py-3 text-sm text-white hover:bg-[#06689e] disabled:opacity-50";
export const field =
  "mt-2 w-full rounded-lg border border-[#dfe7ed] bg-white p-3 text-sm";
export function Field({ label, children }) {
  return (
    <label className="block text-xs font-medium text-[#547086]">
      {label}
      {children}
    </label>
  );
}
export function Dialog({ title, onClose, children, busy }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    node.showModal();
    return () => node.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      className="m-auto max-h-[90dvh] w-[min(520px,calc(100%-32px))] overflow-auto rounded-2xl border-0 p-6 text-[#183247] shadow-xl backdrop:bg-[#071b2a88]"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl">{title}</h2>
        <button disabled={busy} aria-label="Close" onClick={onClose}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Status({ loading, error }) {
  return loading ? (
    <p role="status" className={panel}>
      Loading your plan…
    </p>
  ) : error ? (
    <p role="alert" className={panel}>
      {error} Refresh to retry.
    </p>
  ) : null;
}
