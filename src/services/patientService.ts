import { api } from '../core/http/client';
import type { IPatientService } from '../core/interfaces/IPatientService';
import type { Patient, PatientListResponse, CreatePatientPayload, UpdatePatientPayload } from '../core/dtos/patientDTO';

class PatientService implements IPatientService {
  async list(): Promise<PatientListResponse> {
    const { data } = await api.get<PatientListResponse>('/patients');
    return data;
  }

  async create(payload: CreatePatientPayload): Promise<Patient> {
    const { data } = await api.post<Patient>('/patients', payload);
    return data;
  }

  async update(id: string, payload: UpdatePatientPayload): Promise<Patient> {
    const { data } = await api.put<Patient>(`/patients/${id}`, payload);
    return data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/patients/${id}`);
  }
}

export const patientService = new PatientService();
