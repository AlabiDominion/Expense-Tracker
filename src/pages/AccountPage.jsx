import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../services/authApi";
import { initials } from "../utils/profile";

function DeleteAccountDialog({ onClose }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const dialog = useRef(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  async function remove(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await authApi.deleteAccount(password);
      setUser(null);
      navigate("/", { replace: true });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className="m-auto w-[min(460px,calc(100vw-32px))] rounded-2xl border border-[#dce6ed] bg-white p-6 shadow-2xl backdrop:bg-[#071b2a99]"
      aria-labelledby="delete-account-title"
    >
      <h2 id="delete-account-title" className="text-xl">
        Delete your account?
      </h2>
      <p className="mt-4 text-xs">
        Your account, categories, and all saved transactions will be permanently
        removed. Export your records first if you want to keep a copy.
      </p>
      <form className="mt-5" onSubmit={remove}>
        <label className="grid gap-2 text-xs">
          Confirm your password
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="mt-4 text-xs text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            disabled={busy}
            className="border-red-600 bg-red-600 text-white hover:bg-red-700"
          >
            {busy ? "Deleting…" : "Permanently delete account"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default function AccountPage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    try {
      setUser(await authApi.profile(name));
      setNotice("Your profile has been updated.");
    } catch (failure) {
      setNotice(failure.message);
    } finally {
      setBusy(false);
    }
  }
  async function download() {
    try {
      const data = await authApi.export();
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "cloudberth-my-records.json";
      link.click();
      URL.revokeObjectURL(url);
      setNotice("Your data export is ready.");
    } catch (failure) {
      setNotice(failure.message);
    }
  }
  return (
    <div className="grid max-w-[750px] gap-6">
      {notice && (
        <p
          role="status"
          className="rounded-lg border border-[#d8e7f1] bg-[#edf6fc] p-4 text-xs text-[#176696]"
        >
          {notice}
        </p>
      )}
      <section className="rounded-xl border border-[#dce6ed] bg-white p-6">
        <div className="mb-6 flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-[#e5f0f8] text-lg text-[#497d9f]">
            {initials(user.name)}
          </span>
          <div>
            <h3>Your profile</h3>
            <p className="mt-1 text-xs">{user.email}</p>
          </div>
        </div>
        <form onSubmit={save} className="grid gap-4">
          <label className="grid gap-2 text-xs text-[#647d90]">
            Full name
            <input
              required
              minLength={2}
              maxLength={100}
              value={name}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button
            className="w-fit border-[#087dbd] bg-[#087dbd] text-white hover:bg-[#06689e]"
            disabled={busy}
          >
            {busy ? "Saving…" : "Save profile"}
          </button>
        </form>
      </section>
      <section className="rounded-xl border border-[#dce6ed] bg-white p-6">
        <h3>Your records</h3>
        <p className="mt-3 text-xs">
          Download your complete personal workspace, including categories and
          transactions, as a JSON file. Monthly CSV and PDF exports are
          available in Reports.
        </p>
        <button className="mt-5" onClick={download}>
          Download all my data
        </button>
      </section>
      <section className="rounded-xl border border-red-100 bg-white p-6">
        <h3>Close your account</h3>
        <p className="mt-3 text-xs">
          Permanently delete your account and saved records.
        </p>
        <button
          onClick={() => setDeleting(true)}
          className="mt-5 border-red-100 text-red-600 hover:bg-red-50"
        >
          Delete my account
        </button>
      </section>
      {deleting && <DeleteAccountDialog onClose={() => setDeleting(false)} />}
    </div>
  );
}
