'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDeletePatient, useDoctorOptions, usePatients } from '@/hooks/use-api';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  ErrorState,
  inputClass,
  LoadingState,
  PageHeader,
  PaginationControls,
  selectClass,
} from '@/components/ui/common';
import { GENDERS, ITEMS_PER_PAGE, PATIENT_CONDITIONS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import type { PatientListParams } from '@/lib/types';

export function PatientsView() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [gender, setGender] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [sort, setSort] = useState<PatientListParams['sort']>('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const params = useMemo<PatientListParams>(
    () => ({
      page,
      limit: ITEMS_PER_PAGE,
      search: search || undefined,
      condition: condition || undefined,
      gender: gender || undefined,
      doctorId: doctorId || undefined,
      sort,
    }),
    [page, search, condition, gender, doctorId, sort],
  );

  const { data, isPending, isError, error, refetch } = usePatients(params);
  const { data: doctors } = useDoctorOptions();
  const deletePatient = useDeletePatient();

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await deletePatient.mutateAsync(id);
      toast.success('Patient deleted');
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Could not delete the patient');
    }
  }

  const patients = data?.data ?? [];
  const pagination = data?.pagination ?? { page, limit: ITEMS_PER_PAGE, total: 0, totalPages: 0 };

  return (
    <>
      <PageHeader
        title="Patients"
        description="Track registered patients, their conditions and assigned doctors."
        action={
          <Link href="/patients/new" className={buttonVariants()}>
            <Plus className="size-4" />
            Add patient
          </Link>
        }
      />

      <div className="mb-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative sm:col-span-2">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            type="search"
            aria-label="Search patients"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search patients…"
            className={`${inputClass} pl-9`}
          />
        </div>
        <select
          value={condition}
          onChange={(event) => {
            setCondition(event.target.value);
            setPage(1);
          }}
          className={selectClass}
          aria-label="Filter by condition"
        >
          <option value="">All conditions</option>
          {PATIENT_CONDITIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={doctorId}
          onChange={(event) => {
            setDoctorId(event.target.value);
            setPage(1);
          }}
          className={selectClass}
          aria-label="Filter by doctor"
        >
          <option value="">All doctors</option>
          {doctors?.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={gender}
            onChange={(event) => {
              setGender(event.target.value);
              setPage(1);
            }}
            className={selectClass}
            aria-label="Filter by gender"
          >
            <option value="">All genders</option>
            {GENDERS.map((item) => (
              <option key={item} value={item}>
                {item[0]?.toUpperCase()}{item.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as PatientListParams['sort']);
              setPage(1);
            }}
            className={selectClass}
            aria-label="Sort patients"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name A–Z</option>
            <option value="age">Oldest first</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {isPending ? (
          <LoadingState label="Loading patients…" />
        ) : isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : 'Could not load patients'}
            onRetry={() => void refetch()}
          />
        ) : patients.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <p className="text-muted-foreground text-sm">No patients match your filters.</p>
            <Link href="/patients/new" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              Add a patient
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Condition</th>
                  <th className="px-4 py-3 font-medium">Doctor</th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">Registered</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {patient.age} years · {patient.gender ?? 'Not specified'}
                      </p>
                    </td>
                    <td className="px-4 py-3">{patient.condition}</td>
                    <td className="px-4 py-3">
                      {patient.doctor ? (
                        <span>
                          {patient.doctor.name}
                          <span className="text-muted-foreground block text-xs">
                            {patient.doctor.specialization}
                          </span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="text-muted-foreground hidden px-4 py-3 lg:table-cell">
                      {formatDate(patient.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/patients/${patient.id}/edit`}
                          aria-label={`Edit ${patient.name}`}
                          className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                          disabled={deletePatient.isPending}
                          onClick={() => void handleDelete(patient.id, patient.name)}
                          aria-label={`Delete ${patient.name}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isPending && !isError && patients.length > 0 ? (
          <PaginationControls pagination={pagination} onChange={setPage} />
        ) : null}
      </div>
    </>
  );
}
