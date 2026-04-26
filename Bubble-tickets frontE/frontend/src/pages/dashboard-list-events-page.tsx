import NavBar from "@/components/nav-bar";
import EmptyState from "@/components/empty-state";
import LoadingState from "@/components/loading-state";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  EventSummary,
  EventStatusEnum,
  SpringBootPagination,
} from "@/domain/domain";
import { deleteEvent, listEvents } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import {
  AlertCircle,
  Calendar,
  CalendarPlus,
  Clock,
  Edit,
  MapPin,
  Tag,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const DashboardListEventsPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [events, setEvents] = useState<
    SpringBootPagination<EventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [deleteEventError, setDeleteEventError] = useState<
    string | undefined
  >();

  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<
    EventSummary | undefined
  >();

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }
    let ignore = false;
    const token = user.access_token;
    (async () => {
      try {
        const data = await listEvents(token, page);
        if (!ignore) setEvents(data);
      } catch (err) {
        if (ignore) return;
        setError(getErrorMessage(err));
      }
    })();
    return () => {
      ignore = true;
    };
  }, [isLoading, user, page]);

  const refreshEvents = async (accessToken: string) => {
    try {
      setEvents(await listEvents(accessToken, page));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) {
      return "TBD";
    }
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date?: Date) => {
    if (!date) {
      return "";
    }
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatusBadge = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.DRAFT:
        return "bg-gray-700 text-gray-200";
      case EventStatusEnum.PUBLISHED:
        return "bg-green-700 text-green-100";
      case EventStatusEnum.CANCELLED:
        return "bg-red-700 text-red-100";
      case EventStatusEnum.COMPLETED:
        return "bg-blue-700 text-blue-100";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  const handleOpenDeleteEventDialog = (event: EventSummary) => {
    setEventToDelete(event);
    setDeleteEventError(undefined);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEventToDelete(undefined);
      setDeleteEventError(undefined);
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || isLoading || !user?.access_token) {
      return;
    }

    try {
      setDeleteEventError(undefined);
      await deleteEvent(user.access_token, eventToDelete.id);
      setEventToDelete(undefined);
      setDialogOpen(false);
      refreshEvents(user.access_token);
    } catch (err) {
      setDeleteEventError(getErrorMessage(err));
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

  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />

      <div className="max-w-lg mx-auto px-4">
        {/* Title */}
        <div className="py-8 px-4 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Events</h1>
            <p>Events you have created</p>
          </div>
          <div>
            <Link to="/dashboard/events/create">
              <Button className="bg-purple-700 hover:bg-purple-500 cursor-pointer">
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Event Cards */}
        {!events ? (
          <LoadingState label="Loading events…" />
        ) : events.content.length === 0 ? (
          <EmptyState
            icon={<CalendarPlus className="h-10 w-10" />}
            title="No events yet"
            description="Create your first event to start selling tickets."
            action={
              <Link to="/dashboard/events/create">
                <Button className="bg-purple-700 hover:bg-purple-500 cursor-pointer">
                  Create Event
                </Button>
              </Link>
            }
          />
        ) : (
        <div className="space-y-2">
          {events.content.map((eventItem) => (
            <Card
              key={eventItem.id}
              className="bg-gray-900 border-gray-700 text-white"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <h3 className="font-bold text-xl">{eventItem.name}</h3>
                  <span
                    className={`flex items-center px-2 py-1 rounded-lg text-xs ${formatStatusBadge(eventItem.status)}`}
                  >
                    {eventItem.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Start & End */}
                <div className="flex space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {formatDate(eventItem.start)} to{" "}
                      {formatDate(eventItem.end)}
                    </p>
                    <p className="text-gray-400">
                      {formatTime(eventItem.start)} -{" "}
                      {formatTime(eventItem.end)}
                    </p>
                  </div>
                </div>
                {/* Sales start and end */}
                <div className="flex space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">Sales Period</h4>
                    <p className="text-gray-400">
                      {formatDate(eventItem.salesStart)} to{" "}
                      {formatDate(eventItem.salesEnd)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{eventItem.venue}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">Ticket Types</h4>
                    <ul>
                      {eventItem.ticketTypes.map((ticketType) => (
                        <li
                          key={ticketType.id}
                          className="flex gap-2 text-gray-400"
                        >
                          <span>{ticketType.name}</span>
                          <span>${ticketType.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Link to={`/dashboard/events/update/${eventItem.id}`}>
                  <Button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-500 cursor-pointer"
                  >
                    <Edit />
                  </Button>
                </Link>
                <Button
                  type="button"
                  aria-label={`Delete event ${eventItem.name}`}
                  className="bg-red-700/80 hover:bg-red-500 cursor-pointer"
                  onClick={() => handleOpenDeleteEventDialog(eventItem)}
                >
                  <Trash />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        )}
      </div>
      {events && events.totalPages > 1 && (
        <div className="flex justify-center py-8">
          <SimplePagination pagination={events} onPageChange={setPage} />
        </div>
      )}
      <AlertDialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete your event '{eventToDelete?.name}' and cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteEventError && (
            <Alert variant="destructive" className="border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteEvent()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardListEventsPage;
