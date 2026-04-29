import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getErrorMessage } from "@/lib/get-error-message";

const CallbackPage: React.FC = () => {
  const { isLoading, isAuthenticated, signinRedirectCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();

  const finalizeRedirect = () => {
    const redirectPath = localStorage.getItem("redirectPath");
    if (redirectPath) {
      localStorage.removeItem("redirectPath");
      navigate(redirectPath, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      finalizeRedirect();
      return;
    }

    let ignore = false;
    const run = async () => {
      try {
        await signinRedirectCallback();
        if (ignore) return;
        finalizeRedirect();
      } catch (err) {
        if (ignore) return;
        setError(getErrorMessage(err));
      }
    };

    run();
    return () => {
      ignore = true;
    };
  }, [isLoading, isAuthenticated, navigate, signinRedirectCallback]);

  if (isLoading) {
    return <p>Processing login...</p>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <p>Completing login...</p>;
};

export default CallbackPage;
