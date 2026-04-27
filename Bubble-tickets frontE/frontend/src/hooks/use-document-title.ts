import { useEffect } from "react";

const APP_NAME = "Event Ticket Platform";

export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = previous;
    };
  }, [title]);
};
