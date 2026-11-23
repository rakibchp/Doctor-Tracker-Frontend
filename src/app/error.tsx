'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-muted/40 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-destructive text-sm font-medium">Something went wrong</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">We couldn&apos;t load this page</h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        Please try again. If the problem continues, check that the API is running.
      </p>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={reset} className={buttonVariants()}>
          Try again
        </button>
        <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
          Dashboard
        </Link>
      </div>
    </main>
  );
}
