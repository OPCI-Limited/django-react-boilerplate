export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatDateForInput(dateStr: string): string {
  const date = new Date(dateStr);

  // Helper function to ensure 2-digit format (e.g. 03, 09)
  const pad = (n: number) => n.toString().padStart(2, '0');

  // Construct a string formatted like "2025-05-13T14:30"
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseInputToUTC(localDateTime: string): string {
  const localDate = new Date(localDateTime);
  return localDate.toISOString();
}

export function formatDateForGrouping(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
