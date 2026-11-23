'use client';

import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination as PaginationMeta } from '@/lib/types';
import { Button } from './button';

export const inputClass =
  'border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-3 text-sm outline-none focus-visible:ring-3 disabled:opacity-50';

export const selectClass = `${inputClass} pr-8`;

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const messageId = useId();
  const describedBy = error || hint ? messageId : undefined;
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })
    : children;

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {control}
      {error ? (
        <span id={messageId} role="alert" className="text-destructive text-xs">
          {error}
        </span>
      ) : hint ? (
        <span id={messageId} className="text-muted-foreground text-xs">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={
        active
          ? 'inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400'
          : 'bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
      }
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

export function PaginationControls({
  pagination,
  onChange,
}: {
  pagination: PaginationMeta;
  onChange: (page: number) => void;
}) {
  return (
    <div className="text-muted-foreground flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs">
      <span>
        Page {pagination.page} of {Math.max(pagination.totalPages, 1)} · {pagination.total} records
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pagination.page <= 1}
          onClick={() => onChange(pagination.page - 1)}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onChange(pagination.page + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="text-muted-foreground flex min-h-48 items-center justify-center text-sm"
    >
      {label}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="border-destructive/30 bg-destructive/5 flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center"
    >
      <p className="text-destructive text-sm font-medium">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
