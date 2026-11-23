export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface DoctorSummary {
  id: string;
  name: string;
  specialization: string;
  isActive: boolean;
}

export interface Doctor extends DoctorSummary {
  hospital: string | null;
  phone: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  patientCount: number;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | 'other' | null;
  phone: string | null;
  condition: string;
  doctorId: string | null;
  doctor: Pick<DoctorSummary, 'id' | 'name' | 'specialization'> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
  errors?: FieldError[];
}

export interface DashboardOverview {
  summary: {
    totalDoctors: number;
    activeDoctors: number;
    inactiveDoctors: number;
    totalPatients: number;
    newPatientsThisMonth: number;
  };
  registrationTrend: { key: string; label: string; patients: number }[];
  doctorsBySpecialization: { name: string; doctors: number }[];
  patientsByCondition: { name: string; patients: number }[];
  topDoctors: { id: string; name: string; specialization: string; patients: number }[];
  recentPatients: Patient[];
  recentDoctors: Doctor[];
  generatedAt: string;
}

export interface DoctorListParams {
  page: number;
  limit: number;
  search?: string;
  specialization?: string;
  isActive?: boolean;
  sort: 'newest' | 'oldest' | 'name';
}

export interface PatientListParams {
  page: number;
  limit: number;
  search?: string;
  condition?: string;
  gender?: string;
  doctorId?: string;
  sort: 'newest' | 'oldest' | 'name' | 'age';
}

export type DoctorInput = Pick<Doctor, 'name' | 'specialization' | 'hospital' | 'phone' | 'email' | 'isActive'>;

export interface PatientInput {
  name: string;
  dateOfBirth: string;
  gender: '' | 'male' | 'female' | 'other';
  phone: string;
  condition: string;
  doctorId: string;
}
