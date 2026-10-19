const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
export async function request(path, options = {}) {
  const { timeout = 5000, ...fetchOptions } = options;
  const response = await fetch(`${API}${path}`, {
    ...fetchOptions,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    signal: AbortSignal.timeout(timeout),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      typeof body.detail === "string"
        ? body.detail
        : "Request failed. Please check your entries.",
    );
  }
  return response.status === 204 ? null : response.json();
}
