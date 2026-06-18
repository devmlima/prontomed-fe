import { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { patientService } from '../../../services/patientService';
import type { Patient } from '../../../core/dtos/patientDTO';

type ModalMode = 'create' | 'edit' | null;

interface PatientFormData {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
  height: string;
  weight: string;
}

const emptyForm: PatientFormData = {
  name: '',
  phone: '',
  email: '',
  birthDate: '',
  gender: 'M',
  height: '',
  weight: '',
};

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [form, setForm] = useState<PatientFormData>(emptyForm);

  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await patientService.list();
      setPatients(res.data);
    } catch {
      setError('Erro ao carregar pacientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  function handleFormChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function openCreate() {
    setForm(emptyForm);
    setSelected(null);
    setModalMode('create');
    setError('');
  }

  function openEdit(patient: Patient) {
    setForm({
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      birthDate: patient.birthDate.split('T')[0],
      gender: patient.gender,
      height: patient.height ? String(patient.height) : '',
      weight: patient.weight ? String(patient.weight) : '',
    });
    setSelected(patient);
    setModalMode('edit');
    setActionMenuId(null);
    setError('');
  }

  function closeModal() {
    setModalMode(null);
    setSelected(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        birthDate: form.birthDate,
        gender: form.gender as 'M' | 'F' | 'O',
        height: parseFloat(form.height) || 0,
        weight: parseFloat(form.weight) || 0,
      };
      if (modalMode === 'create') {
        await patientService.create(payload);
      } else if (selected) {
        await patientService.update(selected.id, payload);
      }
      await fetchPatients();
      closeModal();
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Erro ao salvar paciente.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError('');
    try {
      await patientService.delete(id);
      await fetchPatients();
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Erro ao excluir paciente.');
    } finally {
      setDeleteConfirmId(null);
    }
  }

  return {
    patients, loading, error, saving,
    modalMode, selected, form,
    actionMenuId, setActionMenuId,
    deleteConfirmId, setDeleteConfirmId,
    openCreate, openEdit, closeModal,
    handleFormChange, handleSubmit, handleDelete,
  };
}
