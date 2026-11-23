'use client';

import { use } from 'react';
import { PatientForm } from '../../patient-form';

export function EditPatient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PatientForm id={id} />;
}
