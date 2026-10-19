import { request } from "./http";

export function previewStatement(file) {
  const body = new FormData();
  body.append("file", file);
  return request("/statements/preview", {
    method: "POST",
    body,
    timeout: 60000,
  });
}

export function importStatement(scope, rows) {
  return request("/statements/import", {
    method: "POST",
    body: JSON.stringify({ scope, rows }),
    timeout: 60000,
  });
}
