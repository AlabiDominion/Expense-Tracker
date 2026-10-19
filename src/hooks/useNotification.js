import { useEffect, useState } from "react";

export function useNotification() {
  const [notice, notify] = useState("");
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => notify(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  return { notice, notify };
}
