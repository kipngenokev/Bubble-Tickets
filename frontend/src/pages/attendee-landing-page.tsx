import { useAuth } from "react-oidc-context";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CalendarOff, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { PublishedEventSummary, SpringBootPagination } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";
import PublicNavBar from "@/components/public-nav-bar";
import EmptyState from "@/components/empty-state";
import LoadingState from "@/components/loading-state";

const AttendeeLandingPage: React.FC = () => {
  const { isLoading } = useAuth();

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<
    SpringBootPagination<PublishedEventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [query, setQuery] = useState<string | undefined>();

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      try {
        const data =
          query && query.length > 0
            ? await searchPublishedEvents(query, page)
            : await listPublishedEvents(page);
        if (!ignore) setPublishedEvents(data);
      } catch (err) {
        if (ignore) return;
        setError(getErrorMessage(err));
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [page, query]);

  const queryPublishedEvents = async () => {
    const nextPage = 0;
    setPage(nextPage);
    try {
      const data =
        query && query.length > 0
          ? await searchPublishedEvents(query, nextPage)
          : await listPublishedEvents(nextPage);
      setPublishedEvents(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <PublicNavBar />
      {/* Hero */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-[url(/organizers-landing-hero.png)] bg-cover min-h-[200px] rounded-lg bg-bottom md:min-h-[250px]">
          <div className="bg-black/45 min-h-[200px] md:min-h-[250px] p-8 md:p-20">
            <h1 className="text-2xl font-bold mb-4">
              Find Tickets to Your Next Event
            </h1>
            <form
              className="flex gap-2 max-w-lg"
              onSubmit={(e) => {
                e.preventDefault();
                queryPublishedEvents();
              }}
            >
              <Input
                className="bg-white text-black"
                value={query ?? ""}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search events"
                placeholder="Search by name or venue"
              />
              <Button type="submit" aria-label="Search">
                <Search />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Published Event Cards */}
      {publishedEvents && publishedEvents.content.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {publishedEvents.content.map((publishedEvent) => (
            <PublishedEventCard
              publishedEvent={publishedEvent}
              key={publishedEvent.id}
            />
          ))}
        </div>
      ) : publishedEvents ? (
        <EmptyState
          icon={<CalendarOff className="h-10 w-10" />}
          title={
            query && query.length > 0
              ? `No events match "${query}"`
              : "No events are published yet"
          }
          description={
            query && query.length > 0
              ? "Try a different search term."
              : "Check back soon — new events are added regularly."
          }
        />
      ) : (
        <LoadingState label="Loading events…" />
      )}

      {publishedEvents && publishedEvents.totalPages > 1 && (
        <div className="w-full flex justify-center py-8">
          <SimplePagination
            pagination={publishedEvents}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default AttendeeLandingPage;
