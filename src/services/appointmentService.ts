import { AxiosError } from 'axios';
import { api } from '../core/http/client';
import type { IAppointmentService } from '../core/interfaces/IAppointmentService';
import type { Appointment, AppointmentListResponse, CreateAppointmentPayload, UpdateAppointmentPayload } from '../core/dtos/appointmentDTO';

function resolveError(err: unknown, fallback: string): never {
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    if (status === 409) {
      throw new Error('Já existe um agendamento nesse horário. Escolha outro horário ou duração.');
    }
    if (status === 403) throw new Error('Você não tem permissão para realizar esta ação.');
    if (status === 404) throw new Error('Agendamento não encontrado.');
    const msg = err.response?.data?.message;
    if (msg) throw new Error(msg);
  }
  throw new Error(fallback);
}

class AppointmentService implements IAppointmentService {
  async list(): Promise<AppointmentListResponse> {
    try {
      const { data } = await api.get<AppointmentListResponse>('/appointments');
      return data;
    } catch (err) {
      resolveError(err, 'Erro ao carregar agendamentos.');
    }
  }

  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    try {
      const { data } = await api.post<Appointment>('/appointments', payload);
      return data;
    } catch (err) {
      resolveError(err, 'Erro ao criar agendamento.');
    }
  }

  async update(id: string, payload: UpdateAppointmentPayload): Promise<Appointment> {
    try {
      const { data } = await api.put<Appointment>(`/appointments/${id}`, payload);
      return data;
    } catch (err) {
      resolveError(err, 'Erro ao atualizar agendamento.');
    }
  }

  async cancel(id: string): Promise<void> {
    try {
      await api.patch(`/appointments/${id}/cancel`);
    } catch (err) {
      resolveError(err, 'Erro ao cancelar agendamento.');
    }
  }
}

export const appointmentService = new AppointmentService();
