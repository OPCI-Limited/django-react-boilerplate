export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);

  return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}
