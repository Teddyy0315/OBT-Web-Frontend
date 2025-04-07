import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    validateToken().then((res) => {
      if (res.valid) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <LoginForm />
    </div>
  );
}
