const PREFIX = "ecews";

export function readStoredData(key, fallback) {
  try {
    // Preserve demo records created before the ECEWS rebrand.
    const value =
      localStorage.getItem(`${PREFIX}-${key}`) ??
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
