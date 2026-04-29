export const getErrorMessage = (
  err: unknown,
  fallback = "An unknown error has occurred",
): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return fallback;
};
