import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/Login/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LoginPage /> }, // startpagina
    ],
  },
]);
