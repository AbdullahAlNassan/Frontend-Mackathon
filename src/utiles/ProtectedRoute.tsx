import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authApi } from "../services/api";

const LOGIN_PATH = "/inloggen";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    authApi
      .me()
      .then(() => setAllowed(true))
      .catch(() => setAllowed(false));
  }, []);

  if (allowed === null) return <div>Loading...</div>;
  if (allowed === false) return <Navigate to={LOGIN_PATH} replace />;

  return children;
}
