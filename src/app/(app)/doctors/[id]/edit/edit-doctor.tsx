'use client';

import { use } from 'react';
import { DoctorForm } from '../../doctor-form';

export function EditDoctor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <DoctorForm id={id} />;
}
