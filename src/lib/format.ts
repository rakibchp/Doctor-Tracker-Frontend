import { format, isValid, parseISO } from 'date-fns';

export function formatDate(value: string): string {
  const date = parseISO(value);
  return isValid(date) ? format(date, 'MMM d, yyyy') : '—';
}

export function formatDateTime(value: string): string {
  const date = parseISO(value);
  return isValid(date) ? format(date, 'MMM d, yyyy · h:mm a') : '—';
}

export function toDateInputValue(value: string): string {
  const date = parseISO(value);
  return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
