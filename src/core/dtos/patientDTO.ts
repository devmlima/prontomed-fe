export type Gender = 'M' | 'F' | 'O';

export interface Patient {
  id: string;
  doctorId: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: Gender;
  height: number;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface PatientListResponse {
  data: Patient[];
  total: number;
}

export interface CreatePatientPayload {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: Gender;
  height: number;
  weight: number;
}

export type UpdatePatientPayload = Partial<CreatePatientPayload>;
