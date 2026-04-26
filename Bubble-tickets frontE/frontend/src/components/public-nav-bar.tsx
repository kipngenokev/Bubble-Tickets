import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

const PublicNavBar: React.FC = () => {
  const { isAuthenticated, signinRedirect, signoutRedirect } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-end p-4 container mx-auto">
      {isAuthenticated ? (
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer"
          >
            Dashboard
          </Button>
          <Button
            onClick={() => signoutRedirect()}
            className="cursor-pointer"
          >
            Log out
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Button
            onClick={() => signinRedirect()}
            className="cursor-pointer"
          >
            Log in
          </Button>
        </div>
      )}
    </nav>
  );
};

export default PublicNavBar;
