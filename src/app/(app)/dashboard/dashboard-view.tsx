'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  CircleUserRound,
  Stethoscope,
  UserRoundPlus,
} from 'lucide-react';
import { useDashboard } from '@/hooks/use-api';
import { ConditionChart, RegistrationChart, SpecializationChart } from '@/components/charts';
import { ErrorState, LoadingState, PageHeader } from '@/components/ui/common';
import { formatDate, pluralize } from '@/lib/format';

const CARDS = [
  { key: 'totalDoctors', label: 'Total doctors', icon: Stethoscope },
  { key: 'activeDoctors', label: 'Active doctors', icon: Activity },
  { key: 'totalPatients', label: 'Total patients', icon: CircleUserRound },
  { key: 'newPatientsThisMonth', label: 'New this month', icon: UserRoundPlus },
] as const;

export function DashboardView() {
  const { data: overview, isPending, isError, error, refetch } = useDashboard();

  if (isPending) return <LoadingState label="Loading dashboard…" />;
  if (isError || !overview) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Could not load the dashboard'}
        onRetry={() => void refetch()}
      />
    );
  }

  const { summary } = overview;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Overview of your clinic activity · updated ${formatDate(overview.generatedAt)}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map(({ key, label, icon: Icon }) => (
          <div key={key} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-muted-foreground text-sm">{label}</p>
              <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {summary[key].toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Patient registrations</h2>
          <p className="text-muted-foreground mt-0.5 text-xs">Last six months</p>
          <div className="mt-4">
            <RegistrationChart data={overview.registrationTrend} />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Conditions</h2>
          <p className="text-muted-foreground mt-0.5 text-xs">All registered patients</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
            <ConditionChart data={overview.patientsByCondition} />
            <ul className="text-muted-foreground min-w-36 space-y-2 text-xs">
              {overview.patientsByCondition.slice(0, 6).map((item) => (
                <li key={item.name} className="flex items-center justify-between gap-3">
                  <span className="truncate">{item.name}</span>
                  <span className="text-foreground font-medium">{item.patients}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Top doctors</h2>
              <p className="text-muted-foreground mt-0.5 text-xs">By assigned patients</p>
            </div>
            <Link href="/doctors" className="text-primary inline-flex items-center gap-1 text-xs">
              View all <ArrowUpRight className="size-3" />
            </Link>
          </div>
          {overview.topDoctors.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">No data yet.</p>
          ) : (
            <ul className="divide-border divide-y">
              {overview.topDoctors.map((doctor, index) => (
                <li key={doctor.id} className="flex items-center gap-3 py-2.5">
                  <span className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-full text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{doctor.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {doctor.specialization}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{pluralize(doctor.patients, 'patient')}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid gap-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Recent patients</h2>
                <p className="text-muted-foreground mt-0.5 text-xs">Latest registrations</p>
              </div>
              <Link href="/patients" className="text-primary inline-flex items-center gap-1 text-xs">
                View all <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <ul className="divide-border divide-y">
              {overview.recentPatients.map((patient) => (
                <li key={patient.id} className="flex items-center gap-3 py-2.5">
                  <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                    {patient.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{patient.name}</p>
                    <p className="text-muted-foreground truncate text-xs">{patient.condition}</p>
                  </div>
                  <span className="text-muted-foreground text-xs">{formatDate(patient.createdAt)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 font-semibold">Doctor specialties</h2>
            {overview.doctorsBySpecialization.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-sm">No doctors yet.</p>
            ) : (
              <SpecializationChart data={overview.doctorsBySpecialization} />
            )}
          </section>
        </div>
      </div>
    </>
  );
}
