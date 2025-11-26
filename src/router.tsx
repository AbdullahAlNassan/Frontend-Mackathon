import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PlaceholderPage from "./pages/Placeholder/PlaceholderPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";

export const router = createBrowserRouter([
  {
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "test", element: <PlaceholderPage /> },
    ],
  },
]);
