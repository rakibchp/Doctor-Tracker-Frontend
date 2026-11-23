'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteDoctor, useDoctors } from '@/hooks/use-api';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  ErrorState,
  inputClass,
  LoadingState,
  PageHeader,
  PaginationControls,
  selectClass,
  StatusBadge,
} from '@/components/ui/common';
import { ITEMS_PER_PAGE, SPECIALIZATIONS } from '@/lib/constants';
import type { DoctorListParams } from '@/lib/types';

export function DoctorsView() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState<DoctorListParams['sort']>('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const params = useMemo<DoctorListParams>(
    () => ({
      page,
      limit: ITEMS_PER_PAGE,
      search: search || undefined,
      specialization: specialization || undefined,
      isActive: status === 'all' ? undefined : status === 'active',
      sort,
    }),
    [page, search, specialization, status, sort],
  );

  const { data, isPending, isError, error, refetch } = useDoctors(params);
  const deleteDoctor = useDeleteDoctor();

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await deleteDoctor.mutateAsync(id);
      toast.success('Doctor deleted');
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Could not delete the doctor');
    }
  }

  const doctors = data?.data ?? [];
  const pagination = data?.pagination ?? { page, limit: ITEMS_PER_PAGE, total: 0, totalPages: 0 };

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Manage the doctors in your clinic and see how many patients they care for."
        action={
          <Link href="/doctors/new" className={buttonVariants()}>
            <Plus className="size-4" />
            Add doctor
          </Link>
        }
      />

      <div className="mb-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            type="search"
            aria-label="Search doctors"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, specialty or email…"
            className={`${inputClass} pl-9`}
          />
        </div>
        <select
          value={specialization}
          onChange={(event) => {
            setSpecialization(event.target.value);
            setPage(1);
          }}
          className={selectClass}
          aria-label="Filter by specialization"
        >
          <option value="">All specializations</option>
          {SPECIALIZATIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className={selectClass}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as DoctorListParams['sort']);
              setPage(1);
            }}
            className={selectClass}
            aria-label="Sort doctors"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {isPending ? (
          <LoadingState label="Loading doctors…" />
        ) : isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : 'Could not load doctors'}
            onRetry={() => void refetch()}
          />
        ) : doctors.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <p className="text-muted-foreground text-sm">No doctors match your filters.</p>
            <Link href="/doctors/new" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              Add a doctor
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-medium">Doctor</th>
                  <th className="px-4 py-3 font-medium">Specialization</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Hospital</th>
                  <th className="px-4 py-3 font-medium">Patients</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-muted-foreground text-xs">{doctor.email ?? 'No email'}</p>
                    </td>
                    <td className="px-4 py-3">{doctor.specialization}</td>
                    <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                      {doctor.hospital ?? '—'}
                    </td>
                    <td className="px-4 py-3">{doctor.patientCount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge active={doctor.isActive} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/doctors/${doctor.id}/edit`}
                          aria-label={`Edit ${doctor.name}`}
                          className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                          disabled={deleteDoctor.isPending}
                          onClick={() => void handleDelete(doctor.id, doctor.name)}
                          aria-label={`Delete ${doctor.name}`}
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
        {!isPending && !isError && doctors.length > 0 ? (
          <PaginationControls pagination={pagination} onChange={setPage} />
        ) : null}
      </div>
    </>
  );
}
