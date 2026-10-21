import AuthProvider from "./contexts/AuthProvider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import StartupScreen from "./components/StartupScreen.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StartupScreen>
          <App />
        </StartupScreen>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
