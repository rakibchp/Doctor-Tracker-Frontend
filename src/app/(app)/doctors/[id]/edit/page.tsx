import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/common';
import { EditDoctor } from './edit-doctor';

export const metadata: Metadata = { title: 'Edit doctor' };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<LoadingState label="Loading form…" />}>
      <EditDoctor params={params} />
    </Suspense>
  );
}
