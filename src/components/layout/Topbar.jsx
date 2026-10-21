import { useState } from "react";
import { Link } from "react-router-dom";
import { initials } from "../../utils/profile";
export default function Topbar({ page, mode, user, demo, onLogout }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try {
      await onLogout();
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <header className="flex min-h-[74px] flex-wrap items-center justify-between gap-3 border-b border-[#e0e8ef] bg-white px-[38px] py-3 text-[11px] text-[#8b9eac] max-[780px]:px-[18px] print:hidden">
      <span>
        Workspace <span className="mx-3 text-[#c1cfda]">/</span>
        <strong className="font-medium text-[#506d82]">{page}</strong>
      </span>
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-[6px] text-[10px]">
          <i
            className={`size-[6px] rounded-full ${mode === "MySQL API" ? "bg-[#2b956f]" : "bg-[#cba86a]"}`}
          />
          {demo
            ? "Demo workspace"
            : mode === "MySQL API"
              ? "Personal workspace"
              : mode}
        </span>
        {demo ? (
          <>
            <Link to="/login" className="text-[#0b78b6]">
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-[#087dbd] px-4 py-[10px] text-white hover:bg-[#06689e]"
            >
              Create free account
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/account"
              className="flex items-center gap-3"
              aria-label={`Account settings for ${user.name}`}
            >
              <span className="text-[11px] font-medium text-[#506d82] max-[480px]:hidden">
                {user.name}
              </span>
              <span className="grid size-[32px] place-items-center rounded-full bg-[#e5f0f8] text-[10px] font-semibold text-[#497d9f]">
                {initials(user.name)}
              </span>
            </Link>
            <button
              onClick={signOut}
              disabled={busy}
              className="px-3 py-2 text-[10px]"
            >
              {busy ? "Signing out…" : "Sign out"}
            </button>
          </>
        )}
        {error && (
          <span role="alert" className="text-red-600">
            {error}
          </span>
        )}
      </div>
    </header>
  );
}
