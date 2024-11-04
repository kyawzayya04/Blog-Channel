import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routers/index.jsx";
import { ThemeContextProvider } from "./contexts/ThemeContext.jsx";
import AuthContextProvider from "./contexts/AuthContext.jsx";
import Router from "./routers";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ThemeContextProvider>
      <Router />
    </ThemeContextProvider>
  </AuthContextProvider>
);
