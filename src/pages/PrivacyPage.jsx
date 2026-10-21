import { Link } from "react-router-dom";
import Brand from "../components/Brand";
export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[760px] px-6 py-10">
      <Link to="/">
        <Brand />
      </Link>
      <h1 className="mt-12">Your data, your workspace.</h1>
      <div className="mt-7 grid gap-6 text-sm leading-[1.9] text-[#738c9f]">
        {[
          [
            "What we store",
            "Your name, email, password hash, account sessions, categories, and the transactions you choose to save. Passwords are hashed; we do not store the original password.",
          ],
          [
            "Statement imports",
            "A statement is processed to extract transaction details. We do not keep the uploaded PDF. Selected transaction descriptions and amounts are stored when you approve the import.",
          ],
          [
            "Personal accounts",
            "Signed-in records are scoped to your account. The public demo uses sample records stored in the browser and is separate from personal accounts.",
          ],
          [
            "Your choices",
            "You can export your records from Account settings and permanently delete your account and its records. Browser demo records can be removed by clearing this site’s local storage.",
          ],
          [
            "Email and cookies",
            "A session cookie keeps you signed in. Password-reset messages are sent through the configured CloudBerth email service. This tracker does not include advertising trackers.",
          ],
          [
            "Contact",
            "Questions about the tracker or your data? Email support@cloudberth.com.",
          ],
        ].map(([title, text]) => (
          <section key={title}>
            <h3 className="text-[#183247]">{title}</h3>
            <p className="mt-2">{text}</p>
          </section>
        ))}
      </div>
      <Link to="/" className="mt-10 inline-block text-xs text-[#087dbd]">
        ← Back to CloudBerth Expense Tracker
      </Link>
    </main>
  );
}
