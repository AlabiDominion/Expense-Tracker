import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../services/authApi";

export default function AuthPage({ variant = "login" }) {
  const { login, register, setUser, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signup = variant === "register",
    reset = variant === "reset",
    forgot = variant === "forgot";
  const token = new URLSearchParams(location.search).get("token");
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if ((signup || reset) && password !== confirm)
        throw new Error("Your passwords do not match.");
      if (forgot) {
        const result = await authApi.forgot(email);
        setMessage(result.message);
      } else if (reset) {
        if (!token)
          throw new Error("Open the complete password setup or reset link.");
        const result = await authApi.reset({ token, password });
        setMessage(result.message);
        setPassword("");
        setConfirm("");
        setUser(null);
        navigate("/login?password=updated", { replace: true });
      } else {
        if (signup) await register({ name, email, password });
        else await login({ email, password });
        navigate("/overview", { replace: true });
      }
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  const title = signup
    ? "Make room for clarity."
    : reset
      ? "Set your password."
      : forgot
        ? "Let’s get you back in."
        : "Welcome back.";
  return (
    <div className="grid min-h-screen bg-[#f6f8fb] lg:grid-cols-[.9fr_1.1fr]">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-[#0d2b42] p-12 text-white max-lg:hidden">
        <Link to="/" className="inline-flex w-fit items-center gap-3">
          <img
            src="/cloudberth-icon.png"
            alt=""
            className="size-12 rounded-xl bg-white p-1"
          />
          <span className="text-2xl font-semibold">CloudBerth.</span>
        </Link>
        <div className="relative z-1">
          <span className="text-[10px] tracking-[2px] text-[#7aabc9]">
            PERSONAL FINANCE, A LITTLE SIMPLER
          </span>
          <h2 className="mt-6 text-[48px] leading-[1.16] tracking-[-1.8px]">
            Small everyday moves.
            <br />
            <span className="text-[#83bce0]">A clearer tomorrow.</span>
          </h2>
          <p className="mt-6 max-w-[340px] text-sm leading-[1.9] text-[#a2bece]">
            A free space to organize your money, understand your habits, and
            keep moving forward.
          </p>
        </div>
        <span className="text-[10px] text-[#6e94ac]">
          Built by CloudBerth Technologies · Free to use
        </span>
        <div className="pointer-events-none absolute -right-40 bottom-0 size-[500px] rounded-full border border-white/5" />
      </aside>
      <main className="mx-auto flex w-full max-w-[460px] flex-col justify-center px-7 py-12">
        <Link to="/" className="mb-12 w-fit">
          <Brand compact />
        </Link>
        <h1 className="text-[32px] tracking-[-1px]">{title}</h1>
        <p className="mt-3 text-xs text-[#8397a6]">
          {signup
            ? "Your personal workspace starts here."
            : reset
              ? "Choose at least 10 characters for your password."
              : forgot
                ? "We’ll send a reset link if this email has an account."
                : "Sign in to your own private finance workspace."}
        </p>
        {location.search.includes("password=updated") && (
          <p
            role="status"
            className="mt-5 rounded-lg bg-blue-50 p-3 text-xs text-blue-800"
          >
            Password saved. Sign in with your new password.
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-700"
          >
            {error}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="mt-5 rounded-lg bg-blue-50 p-3 text-xs text-blue-800"
          >
            {message}
          </p>
        )}
        <form onSubmit={submit} className="mt-7 grid gap-5">
          {signup && (
            <label className="grid gap-2 text-xs text-[#657e90]">
              Full name
              <input
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="py-3"
              />
            </label>
          )}
          {!reset && (
            <label className="grid gap-2 text-xs text-[#657e90]">
              Email address
              <input
                required
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-3"
              />
            </label>
          )}
          {!forgot && (
            <>
              <label className="grid gap-2 text-xs text-[#657e90]">
                Password
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    minLength={signup || reset ? 10 : 1}
                    maxLength={128}
                    autoComplete={
                      signup || reset ? "new-password" : "current-password"
                    }
                    placeholder={
                      signup || reset
                        ? "At least 10 characters"
                        : "Your password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 border-0 bg-transparent px-2 py-1 text-[10px] text-[#6f899c]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              {(signup || reset) && (
                <label className="grid gap-2 text-xs text-[#657e90]">
                  Confirm password
                  <input
                    required
                    type="password"
                    minLength={10}
                    maxLength={128}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="py-3"
                  />
                </label>
              )}
            </>
          )}
          <button
            disabled={busy}
            className="mt-1 border-[#087dbd] bg-[#087dbd] py-3 text-white hover:bg-[#06689e]"
          >
            {busy
              ? "Please wait…"
              : signup
                ? "Create free account"
                : reset
                  ? "Save password"
                  : forgot
                    ? "Send reset link"
                    : "Sign in"}
          </button>
        </form>
        {!signup && !forgot && !reset && (
          <Link
            to="/forgot-password"
            className="mt-4 text-right text-[11px] text-[#087dbd]"
          >
            Forgot password?
          </Link>
        )}
        <p className="mt-7 text-center text-xs text-[#8a9dab]">
          {signup ? (
            <>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#087dbd]">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New to CloudBerth?{" "}
              <Link to="/register" className="font-semibold text-[#087dbd]">
                Create an account
              </Link>
            </>
          )}
        </p>
        <div className="mt-8 flex justify-between border-t border-[#dfe7ed] pt-5 text-[10px] text-[#8da1af]">
          {!user && <Link to="/demo/overview">Explore the demo →</Link>}
          <Link to="/privacy">Privacy & your data</Link>
        </div>
      </main>
    </div>
  );
}
