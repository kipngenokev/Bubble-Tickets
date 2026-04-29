import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";

const LoginPage: React.FC = () => {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async () => {
    await signinRedirect({
      extraQueryParams: {
        kc_action: "register",
      },
    });
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogin = async () => {
    await signinRedirect();
  };

  return (
    <div
      className="min-h-screen text-white flex items-center justify-center px-4 py-10 bg-slate-950 relative overflow-hidden"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_20%,rgba(16,185,129,0.18),transparent_60%),radial-gradient(700px_circle_at_85%_10%,rgba(245,158,11,0.16),transparent_55%)]" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative w-full max-w-3xl grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-stretch animate-in fade-in duration-700">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-emerald-200">
            Secure access powered by Keycloak
          </div>
          <h1 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight">
            Welcome back to Event Ticket Platform
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-md">
            Manage tickets, create events, and validate attendees without
            leaving your dashboard.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="button"
              className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              onClick={handleLogin}
              disabled={isLoading}
            >
              Log in with Keycloak
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={handleSignup}
              disabled={isLoading}
            >
              Create a new account
            </Button>
          </div>

          <div className="mt-6 text-xs text-slate-400">
            By continuing, you agree to our platform terms and privacy policy.
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold">Not ready to log in?</h2>
            <p className="mt-2 text-sm text-slate-300">
              Browse published events, explore venues, and come back when you
              are ready to buy tickets.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
