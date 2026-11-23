'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiSend } from '@/lib/api';
import type {
  DashboardOverview,
  Doctor,
  DoctorInput,
  DoctorListParams,
  Patient,
  PatientInput,
  PatientListParams,
} from '@/lib/types';

const doctorsKey = ['doctors'] as const;
const patientsKey = ['patients'] as const;
const dashboardKey = ['dashboard'] as const;

export const queryKeys = {
  doctors: (params: DoctorListParams) => [...doctorsKey, params] as const,
  patients: (params: PatientListParams) => [...patientsKey, params] as const,
  doctorOptions: ['doctors', 'options'] as const,
  dashboard: dashboardKey,
};

export function useDoctors(params: DoctorListParams) {
  return useQuery({
    queryKey: queryKeys.doctors(params),
    queryFn: () =>
      apiGet<Doctor[]>('/doctors', {
        page: params.page,
        limit: params.limit,
        search: params.search,
        specialization: params.specialization,
        isActive: params.isActive,
        sort: params.sort,
      }),
  });
}

export function useDoctorOptions() {
  return useQuery({
    queryKey: queryKeys.doctorOptions,
    queryFn: async () => {
      const response = await apiGet<Doctor[]>('/doctors', { limit: 100, isActive: true });
      return response.data;
    },
    staleTime: 60_000,
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: [...doctorsKey, id],
    queryFn: async () => {
      const response = await apiGet<{ doctor: Doctor }>(`/doctors/${id}`);
      return response.data.doctor;
    },
    enabled: Boolean(id),
  });
}

export function useSaveDoctor(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DoctorInput) =>
      apiSend<{ doctor: Doctor }>(id ? `/doctors/${id}` : '/doctors', id ? 'PATCH' : 'POST', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorsKey });
      void queryClient.invalidateQueries({ queryKey: patientsKey });
      void queryClient.invalidateQueries({ queryKey: dashboardKey });
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiSend(`/doctors/${id}`, 'DELETE'),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorsKey });
      void queryClient.invalidateQueries({ queryKey: patientsKey });
      void queryClient.invalidateQueries({ queryKey: dashboardKey });
    },
  });
}

export function usePatients(params: PatientListParams) {
  return useQuery({
    queryKey: queryKeys.patients(params),
    queryFn: () =>
      apiGet<Patient[]>('/patients', {
        page: params.page,
        limit: params.limit,
        search: params.search,
        condition: params.condition,
        gender: params.gender,
        doctorId: params.doctorId,
        sort: params.sort,
      }),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: [...patientsKey, id],
    queryFn: async () => {
      const response = await apiGet<{ patient: Patient }>(`/patients/${id}`);
      return response.data.patient;
    },
    enabled: Boolean(id),
  });
}

export function useSavePatient(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PatientInput) =>
      apiSend<{ patient: Patient }>(
        id ? `/patients/${id}` : '/patients',
        id ? 'PATCH' : 'POST',
        input,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsKey });
      void queryClient.invalidateQueries({ queryKey: doctorsKey });
      void queryClient.invalidateQueries({ queryKey: dashboardKey });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiSend(`/patients/${id}`, 'DELETE'),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsKey });
      void queryClient.invalidateQueries({ queryKey: doctorsKey });
      void queryClient.invalidateQueries({ queryKey: dashboardKey });
    },
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKey,
    queryFn: async () => {
      const response = await apiGet<{ overview: DashboardOverview }>('/dashboard');
      return response.data.overview;
    },
  });
}
