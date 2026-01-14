import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProtectedRoute from "./utiles/ProtectedRoute";
import ContainerDetailPage from "./pages/Dashboard/ContainerDetailPage";
import LogsPage from "./pages/Dashboard/LogsPage";
export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/inloggen",
    element: <LoginPage />,
  },
  {
    path: "/wachtwoord-vergeten",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/containers/:id",
    element: (
      <ProtectedRoute>
        <ContainerDetailPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/logs",
    element: (
      <ProtectedRoute>
        <LogsPage />
      </ProtectedRoute>
    ),
  },
]);
