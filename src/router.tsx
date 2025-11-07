import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PlaceholderPage from "./pages/Placeholder/PlaceholderPage";
import LoginPage from "./pages/Login/LoginPage";
import TwoFactorEmailPage from "./pages/Login/TwoFactorEmailPage"; // ← Nieuwe import

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { index: true, element: <PlaceholderPage /> },
    ],
  },
  {
    path: "/login", 
    element: <LoginPage />,
  },
  {
    path: "/two-factor/email", // ← Nieuwe route
    element: <TwoFactorEmailPage />,
  },
]);