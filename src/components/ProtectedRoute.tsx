import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "@/lib/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const result = await validateToken();
      if (!result.valid) {
        navigate("/login");
      } else {
        setIsValid(true);
      }
      setLoading(false);
    }

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-8">Checking authentication...</div>;
  }

  return isValid ? <>{children}</> : null;
}
