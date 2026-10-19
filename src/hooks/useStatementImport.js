import { useState } from "react";
import { previewStatement, importStatement } from "../services/statementApi";

export function useStatementImport(onImported) {
  const [preview, setPreview] = useState(null);
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [result, setResult] = useState(null);

  async function upload(file) {
    if (!file) return;
    setError("");
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Choose a PDF statement.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("The file must be smaller than 10 MB.");
      return;
    }
    setBusy(true);
    try {
      const response = await previewStatement(file);
      setPreview(response);
      setFilename(file.name);
      setRows(
        response.rows.map((row) => ({
          ...row,
          selected: !row.duplicate && !row.possible_duplicate,
        })),
      );
      setAcknowledged(false);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  function update(rowId, patch) {
    setRows((current) =>
      current.map((row) => (row.row_id === rowId ? { ...row, ...patch } : row)),
    );
    setAcknowledged(false);
  }

  async function confirm() {
    if (busy || !acknowledged) return;
    setBusy(true);
    setError("");
    try {
      const selected = rows.filter((row) => row.selected && !row.duplicate);
      const invalid = selected.find(
        (row) =>
          !row.description.trim() ||
          !/^\d+(\.\d{1,2})?$/.test(String(row.amount)) ||
          Number(row.amount) <= 0 ||
          !/^\d{4}-\d{2}-\d{2}$/.test(row.transaction_date),
      );
      if (invalid)
        throw new Error(
          "Please check the description, date, and positive amount (up to two decimal places) for every selected entry.",
        );
      const response = await importStatement(
        preview.scope,
        selected.map(
          ({
            description,
            amount,
            type,
            category_id,
            transaction_date,
            reference,
          }) => ({
            description,
            amount,
            type,
            category_id: category_id ? Number(category_id) : null,
            transaction_date,
            reference,
          }),
        ),
      );
      setResult(response);
      await onImported(selected);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPreview(null);
    setRows([]);
    setError("");
    setAcknowledged(false);
    setResult(null);
  }
  function selectAll(selected) {
    setRows((current) =>
      current.map((row) => ({
        ...row,
        selected: selected && !row.duplicate && !row.possible_duplicate,
      })),
    );
    setAcknowledged(false);
  }
  return {
    preview,
    rows,
    busy,
    error,
    filename,
    acknowledged,
    setAcknowledged,
    result,
    upload,
    update,
    confirm,
    reset,
    selectAll,
  };
}
