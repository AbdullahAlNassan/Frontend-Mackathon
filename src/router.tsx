import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PlaceholderPage from "./pages/Placeholder/PlaceholderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <PlaceholderPage /> }],
  },
]);
