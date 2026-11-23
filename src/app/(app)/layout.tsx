import { Suspense, type ReactNode } from 'react';
import { AppLayoutClient } from './app-layout-client';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <AppLayoutClient>{children}</AppLayoutClient>
    </Suspense>
  );
}
