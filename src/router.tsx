import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PlaceholderPage from "./pages/Placeholder/PlaceholderPage";
import LoginPage from "./pages/Login/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />, // ← Directe render zonder Layout
  },
  {
    path: "/dashboard",
    element: <Layout />, // ← Alleen dashboard gebruikt Layout
    children: [
      { index: true, element: <PlaceholderPage /> },
    ],
  },
  {
    path: "/login", 
    element: <LoginPage />, // ← Ook apart zonder Layout
  },
]);