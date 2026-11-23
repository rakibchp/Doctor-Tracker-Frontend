import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/common';
import { EditPatient } from './edit-patient';

export const metadata: Metadata = { title: 'Edit patient' };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<LoadingState label="Loading form…" />}>
      <EditPatient params={params} />
    </Suspense>
  );
}
