import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/common';
import { DashboardView } from './dashboard-view';

export const metadata: Metadata = { title: 'Dashboard' };

export default function Page() {
  return (
    <Suspense fallback={<LoadingState label="Loading dashboard…" />}>
      <DashboardView />
    </Suspense>
  );
}
