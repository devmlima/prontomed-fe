import type { Patient, PatientListResponse, CreatePatientPayload, UpdatePatientPayload } from '../dtos/patientDTO';

export interface IPatientService {
  list(): Promise<PatientListResponse>;
  create(data: CreatePatientPayload): Promise<Patient>;
  update(id: string, data: UpdatePatientPayload): Promise<Patient>;
  delete(id: string): Promise<void>;
}
