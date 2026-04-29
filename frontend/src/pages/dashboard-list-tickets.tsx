import EmptyState from "@/components/empty-state";
import LoadingState from "@/components/loading-state";
import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpringBootPagination, TicketSummary } from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { AlertCircle, DollarSign, Tag, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const DashboardListTickets: React.FC = () => {
  const { isLoading, user } = useAuth();

  const [tickets, setTickets] = useState<
    SpringBootPagination<TicketSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }
    let ignore = false;
    const token = user.access_token;

    const doUseEffect = async () => {
      try {
        const data = await listTickets(token, page);
        if (!ignore) setTickets(data);
      } catch (err) {
        if (ignore) return;
        setError(getErrorMessage(err));
      }
    };

    doUseEffect();
    return () => {
      ignore = true;
    };
  }, [isLoading, user?.access_token, page]);

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white">
        <NavBar />
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />

      {/* Title */}
      <div className="py-8 px-4">
        <h1 className="text-2xl font-bold">Your Tickets</h1>
        <p>Tickets you have purchased</p>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {!tickets ? (
          <LoadingState label="Loading tickets…" />
        ) : tickets.content.length === 0 ? (
          <EmptyState
            icon={<Ticket className="h-10 w-10" />}
            title="No tickets yet"
            description="Tickets you purchase will appear here."
            action={
              <Link to="/">
                <Button className="bg-purple-700 hover:bg-purple-500 cursor-pointer">
                  Browse events
                </Button>
              </Link>
            }
          />
        ) : (
          tickets.content.map((ticketItem) => (
          <Link
            key={ticketItem.id}
            to={`/dashboard/tickets/${ticketItem.id}`}
          >
            <Card className="bg-gray-900 text-white">
              <CardHeader>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-gray-300" />
                    <h3 className="font-bold text-xl">
                      {ticketItem.ticketType.name}
                    </h3>
                  </div>
                  <span>{ticketItem.status}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-300" />
                  <p className="font-medium">${ticketItem.ticketType.price}</p>
                </div>

                {/* Ticket ID */}
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-gray-300" />
                  <div>
                    <h4 className="font-medium">Ticket ID</h4>
                    <p className="text-gray-300 font-mono text-sm">
                      {ticketItem.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          ))
        )}
      </div>
      {tickets && tickets.totalPages > 1 && (
        <div className="flex justify-center py-8">
          <SimplePagination pagination={tickets} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default DashboardListTickets;
