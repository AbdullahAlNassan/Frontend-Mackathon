import { Navigate, createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProtectedRoute from "./utiles/ProtectedRoute";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
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
    path: "*",
    element: <NotFoundPage />,
  },
]);
