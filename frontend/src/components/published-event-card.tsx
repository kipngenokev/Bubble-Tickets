import { PublishedEventSummary } from "@/domain/domain";
import { Card } from "./ui/card";
import { Calendar, Heart, MapPin, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";
import { useMemo, useState } from "react";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({
  publishedEvent,
}) => {
  const eventPath = `/events/${publishedEvent.id}`;
  const [shareStatus, setShareStatus] = useState<string | undefined>();
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const stored = globalThis.localStorage?.getItem("savedEvents");
      const parsed = stored ? (JSON.parse(stored) as string[]) : [];
      return parsed.includes(publishedEvent.id);
    } catch {
      return false;
    }
  });

  const shareUrl = useMemo(
    () => `${globalThis.location.origin}${eventPath}`,
    [eventPath],
  );

  const handleToggleSaved = () => {
    setIsSaved((prev) => {
      const next = !prev;
      try {
        const stored = globalThis.localStorage?.getItem("savedEvents");
        const parsed = stored ? (JSON.parse(stored) as string[]) : [];
        const updated = next
          ? Array.from(new Set([...parsed, publishedEvent.id]))
          : parsed.filter((id) => id !== publishedEvent.id);
        globalThis.localStorage?.setItem(
          "savedEvents",
          JSON.stringify(updated),
        );
      } catch {
        // Ignore localStorage failures.
      }
      return next;
    });
  };

  const handleShare = async () => {
    try {
      if (globalThis.navigator?.share) {
        await globalThis.navigator.share({
          title: publishedEvent.name,
          url: shareUrl,
        });
        setShareStatus("Shared");
      } else if (globalThis.navigator?.clipboard?.writeText) {
        await globalThis.navigator.clipboard.writeText(shareUrl);
        setShareStatus("Link copied");
      } else {
        setShareStatus("Copy not supported");
      }
    } catch {
      setShareStatus("Share cancelled");
    }

    window.setTimeout(() => setShareStatus(undefined), 2000);
  };

  return (
    <Card className="py-0 overflow-hidden max-w-[240px] gap-2">
      <Link to={eventPath} className="block">
        {/* Card Image */}
        <div className="h-[140px]">
          <RandomEventImage seed={publishedEvent.id} alt={publishedEvent.name} />
        </div>
        <div className="px-2">
          <h3 className="text-lg font-medium">{publishedEvent.name}</h3>
        </div>
        <div className="px-2">
          <div className="flex gap-2 text-sm mb-2 text-gray-500">
            <MapPin className="w-5" /> {publishedEvent.venue}
          </div>
          <div className="flex gap-2 text-sm mb-2 text-gray-500">
            {publishedEvent.start && publishedEvent.end ? (
              <div className="flex gap-2">
                <Calendar className="w-5" />{" "}
                {format(publishedEvent.start, "PP")} -{" "}
                {format(publishedEvent.end, "PP")}
              </div>
            ) : (
              <div className="flex gap-2">
                <Calendar />
                Dates TBD
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="flex justify-between p-2 border-t text-gray-500 mx-2">
        <button
          type="button"
          aria-label="Save to favorites"
          className={`cursor-pointer ${isSaved ? "text-red-500" : ""}`}
          onClick={handleToggleSaved}
        >
          <Heart />
        </button>
        <button
          type="button"
          aria-label="Share event"
          className="cursor-pointer"
          onClick={handleShare}
        >
          <Share2 />
        </button>
      </div>
      {shareStatus && (
        <div className="px-2 pb-2 text-xs text-gray-500" role="status">
          {shareStatus}
        </div>
      )}
    </Card>
  );
};

export default PublishedEventCard;
