import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PlaceholderPage from "./pages/Placeholder/PlaceholderPage";
import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";

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
      { index: true, element: <DashboardPage /> },
    ],
  },
  {
    path: "/inloggen", // Voor backend redirect compatibility
    element: <LoginPage />,
  },
]);