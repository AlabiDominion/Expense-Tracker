import { useRef } from "react";
export default function StatementUpload({ busy, onUpload }) {
  const input = useRef(null);
  const primary =
    "rounded-lg border-[#248461] bg-[#248461] px-4 py-[10px] text-white hover:bg-[#1a6f50]";
  return (
    <>
      <div
        className="rounded-xl border-2 border-dashed border-[#cbded0] bg-white px-6 py-16 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!busy) onUpload(e.dataTransfer.files[0]);
        }}
      >
        <div className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl bg-[#eaf3ed] text-2xl text-[#248461]">
          ↑
        </div>
        <h3>{busy ? "Reading your statement…" : "Drop your statement here"}</h3>
        <p className="mt-3 text-xs">
          Selectable-text PDF · Moniepoint NGN · Up to 10 MB / 100 pages
        </p>
        <input
          ref={input}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          aria-label="Upload statement PDF"
          onChange={(e) => onUpload(e.target.files[0])}
        />
        <button
          className={`${primary} mt-6`}
          disabled={busy}
          onClick={() => input.current.click()}
        >
          {busy ? "Extracting transactions…" : "Choose PDF statement"}
        </button>
        {busy && (
          <div
            className="mx-auto mt-5 size-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700 motion-reduce:animate-none"
            role="status"
            aria-label="Extracting PDF"
          />
        )}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-4 text-xs max-[600px]:grid-cols-1">
        {[
          [
            "01",
            "Upload",
            "Your PDF is processed locally by this API and is not stored.",
          ],
          [
            "02",
            "Review",
            "Check amounts, categories, and possible duplicates.",
          ],
          ["03", "Import", "Only the entries you approve are saved to MySQL."],
        ].map(([n, title, body]) => (
          <div
            key={n}
            className="rounded-lg border border-[#e2e8e2] bg-white p-4"
          >
            <span className="text-[10px] text-[#7f9383]">{n}</span>
            <strong className="mt-2 block">{title}</strong>
            <p className="mt-2 text-[11px]">{body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
