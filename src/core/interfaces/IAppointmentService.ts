import type { Appointment, AppointmentListResponse, CreateAppointmentPayload, UpdateAppointmentPayload } from '../dtos/appointmentDTO';

export interface IAppointmentService {
  list(): Promise<AppointmentListResponse>;
  create(data: CreateAppointmentPayload): Promise<Appointment>;
  update(id: string, data: UpdateAppointmentPayload): Promise<Appointment>;
  cancel(id: string): Promise<void>;
}
