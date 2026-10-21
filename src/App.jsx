import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import WorkspaceApp from "./WorkspaceApp";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PrivacyPage from "./pages/PrivacyPage";

export default function App() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  if (loading)
    return (
      <div
        className="grid min-h-screen place-items-center text-xs text-[#7691a4]"
        role="status"
      >
        Opening your workspace…
      </div>
    );
  if (pathname === "/privacy") return <PrivacyPage />;
  if (pathname === "/reset-password") return <AuthPage variant="reset" />;
  if (user) {
    if (
      ["/", "/login", "/register", "/forgot-password"].includes(pathname) ||
      pathname.startsWith("/demo")
    )
      return <Navigate to="/overview" replace />;
    return <WorkspaceApp key={user.id} user={user} />;
  }
  if (pathname.startsWith("/demo/"))
    return <WorkspaceApp key="public-demo" demo />;
  if (pathname === "/") return <LandingPage />;
  if (pathname === "/login") return <AuthPage key="login" />;
  if (pathname === "/register")
    return <AuthPage key="register" variant="register" />;
  if (pathname === "/forgot-password")
    return <AuthPage key="forgot" variant="forgot" />;
  return <Navigate to="/login" replace />;
}
