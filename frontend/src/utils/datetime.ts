export const formatDateTime = (date: Date | string | undefined): string => {
  if (!date) return "Unknown time";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
  });
};
