import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPeriod(
  start: string,
  end: string | null
): { display: string; duration: string } {
  const display = end ? `${start} — ${end}` : `${start} — Present`;

  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let duration = "";
  if (years > 0) duration += `${years}y `;
  if (remainingMonths > 0) duration += `${remainingMonths}mo`;
  if (!duration) duration = "< 1mo";

  return { display, duration: duration.trim() };
}
