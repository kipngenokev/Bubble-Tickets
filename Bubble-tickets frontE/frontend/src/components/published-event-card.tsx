import { PublishedEventSummary } from "@/domain/domain";
import { Card } from "./ui/card";
import { Calendar, Heart, MapPin, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({
  publishedEvent,
}) => {
  return (
    <Card className="py-0 overflow-hidden max-w-[240px] gap-2">
      <Link to={`/events/${publishedEvent.id}`} className="block">
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
          className="cursor-pointer"
        >
          <Heart />
        </button>
        <button
          type="button"
          aria-label="Share event"
          className="cursor-pointer"
        >
          <Share2 />
        </button>
      </div>
    </Card>
  );
};

export default PublishedEventCard;
