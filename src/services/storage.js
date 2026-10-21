const PREFIX = "cloudberth-demo";

export function readStoredData(key, fallback) {
  try {
    // Keep earlier presentation records without mixing them into personal accounts.
    const value =
      localStorage.getItem(`${PREFIX}-${key}`) ??
      localStorage.getItem(`ecews-${key}`) ??
      localStorage.getItem(`ledger-${key}`);
    const parsed = value ? JSON.parse(value) : null;
    return Array.isArray(parsed) ? parsed : fallback();
  } catch {
    return fallback();
  }
}

export function saveStoredData(key, value) {
  localStorage.setItem(`${PREFIX}-${key}`, JSON.stringify(value));
}
