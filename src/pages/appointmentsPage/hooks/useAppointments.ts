import { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { appointmentService } from '../../../services/appointmentService';
import { patientService } from '../../../services/patientService';
import type { Appointment, AppointmentStatus } from '../../../core/dtos/appointmentDTO';
import type { Patient } from '../../../core/dtos/patientDTO';

type ModalMode = 'create' | 'edit' | null;

interface AppointmentFormData {
  patientId: string;
  scheduledAt: string;
  durationMinutes: string;
  status: string;
  notes: string;
}

const emptyForm: AppointmentFormData = {
  patientId: '',
  scheduledAt: '',
  durationMinutes: '30',
  status: 'scheduled',
  notes: '',
};

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [form, setForm] = useState<AppointmentFormData>(emptyForm);

  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [apptRes, patRes] = await Promise.all([
        appointmentService.list(),
        patientService.list(),
      ]);
      setAppointments(apptRes.data);
      setPatients(patRes.data);
    } catch {
      setError('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function getPatientName(patientId: string) {
    return patients.find((p) => p.id === patientId)?.name ?? '—';
  }

  function handleFormChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function openCreate() {
    setForm(emptyForm);
    setSelected(null);
    setModalMode('create');
    setFormError('');
  }

  function openEdit(appt: Appointment) {
    setForm({
      patientId: appt.patientId,
      scheduledAt: appt.scheduledAt.slice(0, 16),
      durationMinutes: String(appt.durationMinutes),
      status: appt.status,
      notes: appt.notes ?? '',
    });
    setSelected(appt);
    setModalMode('edit');
    setActionMenuId(null);
    setFormError('');
  }

  function closeModal() {
    setModalMode(null);
    setSelected(null);
    setForm(emptyForm);
    setFormError('');
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (modalMode === 'create') {
        await appointmentService.create({
          patientId: form.patientId,
          scheduledAt: form.scheduledAt,
          durationMinutes: parseInt(form.durationMinutes) || 30,
          notes: form.notes || undefined,
        });
      } else if (selected) {
        await appointmentService.update(selected.id, {
          patientId: form.patientId,
          scheduledAt: form.scheduledAt,
          durationMinutes: parseInt(form.durationMinutes) || 30,
          notes: form.notes || undefined,
          status: form.status as AppointmentStatus,
        });
      }
      await fetchData();
      closeModal();
    } catch (err: unknown) {
      setFormError((err as Error).message ?? 'Erro ao salvar agendamento.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(id: string) {
    setError('');
    try {
      await appointmentService.cancel(id);
      await fetchData();
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Erro ao cancelar agendamento.');
    } finally {
      setCancelConfirmId(null);
    }
  }

  return {
    appointments, patients, loading, error, formError, saving,
    modalMode, selected, form,
    actionMenuId, setActionMenuId,
    cancelConfirmId, setCancelConfirmId,
    getPatientName,
    openCreate, openEdit, closeModal,
    handleFormChange, handleSubmit, handleCancel,
  };
}
