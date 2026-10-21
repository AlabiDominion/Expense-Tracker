const API =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? `http://${window.location.hostname}:8000` : "/api");
export async function request(path, options = {}) {
  const { timeout = 5000, ...fetchOptions } = options;
  const response = await fetch(`${API}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      "X-Requested-With": "CloudBerth",
      ...options.headers,
    },
    signal: AbortSignal.timeout(timeout),
  });
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("/auth/"))
      window.dispatchEvent(new Event("cloudberth-session-expired"));
    const body = await response.json().catch(() => ({}));
    throw new Error(
      typeof body.detail === "string"
        ? body.detail
        : Array.isArray(body.detail)
          ? body.detail[0]?.msg || "Please check your entries."
          : "Request failed. Please try again.",
    );
  }
  return response.status === 204 ? null : response.json();
}
