'use client';

import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;

  return (
    <html lang="en">
      <body className="bg-muted/40 min-h-screen antialiased">
        <title>Something went wrong · Doctor Tracker</title>
        <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="text-destructive text-sm font-medium">Application error</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Doctor Tracker could not start</h1>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            Reload the page to try again. Contact your administrator if the problem continues.
          </p>
          <button
            type="button"
            onClick={reset}
            className="bg-primary text-primary-foreground mt-6 rounded-lg px-4 py-2 text-sm font-medium"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
