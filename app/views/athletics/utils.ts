import moment from "moment-timezone";

export function formatGameTime(dateStr: string): string {
  const date = moment.tz(dateStr, "M/D/YYYY h:mm:ss A", "America/Chicago");
  const now = moment();

  if (date.isSame(now, "day")) {
    return `Today ${date.format("h:mm A")}`;
  }

  if (date.isSame(now.clone().add(1, "day"), "day")) {
    return `Tomorrow ${date.format("h:mm A")}`;
  }

  if (date.isSame(now.clone().subtract(1, "day"), "day")) {
    return `Yesterday ${date.format("h:mm A")}`;
  }

  return date.fromNow();
}
