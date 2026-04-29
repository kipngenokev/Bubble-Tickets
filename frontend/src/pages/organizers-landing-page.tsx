import { Button } from "@/components/ui/button";
import LoadingState from "@/components/loading-state";
import PublicNavBar from "@/components/public-nav-bar";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const OrganizersLandingPage: React.FC = () => {
  const { isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <PublicNavBar />

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {/* Left Column */}
          <div className="space-y-4 order-2 md:order-1">
            <h1 className="text-3xl md:text-5xl font-bold">
              Create, Manage, and Sell Events Tickets with Ease
            </h1>
            <p className="text-base md:text-xl">
              A complete platform for event organizers to create events, sell
              tickets, and validate attendees with QR Codes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                className="cursor-pointer"
                onClick={() => navigate("/dashboard/events")}
              >
                Create an Event
              </Button>
              <Button onClick={() => navigate("/")}>Browse Events</Button>
            </div>
          </div>
          {/* Right Column */}
          <div className="bg-gray-600 rounded-lg aspect-square w-full max-w-sm mx-auto md:mx-0 overflow-hidden order-1 md:order-2">
            <img
              src="/organizers-landing-hero.png"
              alt="A busy concert"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizersLandingPage;
