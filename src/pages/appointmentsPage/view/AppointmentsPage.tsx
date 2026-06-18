import { useAppointments } from '../hooks/useAppointments';
import styles from './appointments.module.css';

const STATUS_LABEL: Record<string, string> = {
  scheduled: 'Agendado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AppointmentsPage() {
  const {
    appointments, patients, loading, error, formError, saving,
    modalMode, selected, form,
    actionMenuId, setActionMenuId,
    cancelConfirmId, setCancelConfirmId,
    getPatientName,
    openCreate, openEdit, closeModal,
    handleFormChange, handleSubmit, handleCancel,
  } = useAppointments();

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Agenda</h1>
        <button className={styles.btnPrimary} onClick={openCreate}>
          + Novo Agendamento
        </button>
      </div>

      {error && <p className={styles.errorBanner}>{error}</p>}

      {loading ? (
        <p className={styles.loading}>Carregando...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Data</th>
                <th>Duração</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.empty}>
                    Nenhum agendamento encontrado
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id}>
                    <td>{getPatientName(a.patientId)}</td>
                    <td>{formatDateTime(a.scheduledAt)}</td>
                    <td>{a.durationMinutes} min</td>
                    <td>
                      <span className={`${styles.badge} ${styles[a.status]}`}>
                        {STATUS_LABEL[a.status] ?? a.status}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      {actionMenuId === a.id && (
                        <div
                          className={styles.backdrop}
                          onClick={() => setActionMenuId(null)}
                        />
                      )}
                      <div className={styles.actionsWrapper}>
                        <button
                          className={styles.actionsBtn}
                          onClick={() =>
                            setActionMenuId(actionMenuId === a.id ? null : a.id)
                          }
                          disabled={a.status === 'cancelled'}
                        >
                          ···
                        </button>
                        {actionMenuId === a.id && (
                          <div className={styles.dropdown}>
                            <button onClick={() => openEdit(a)}>Editar</button>
                            {a.status !== 'cancelled' && (
                              <button
                                className={styles.dangerItem}
                                onClick={() => {
                                  setCancelConfirmId(a.id);
                                  setActionMenuId(null);
                                }}
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm cancel */}
      {cancelConfirmId && (
        <div className={styles.overlay}>
          <div className={styles.confirmCard}>
            <h2>Cancelar agendamento</h2>
            <p>
              O agendamento será marcado como cancelado. Esta ação não pode ser
              desfeita.
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => setCancelConfirmId(null)}
              >
                Voltar
              </button>
              <button
                className={styles.btnDanger}
                onClick={() => handleCancel(cancelConfirmId)}
              >
                Confirmar cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      {modalMode && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>
                {modalMode === 'create' ? 'Novo Agendamento' : 'Editar Agendamento'}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                ×
              </button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              {formError && <p className={styles.formError}>{formError}</p>}
              <div className={styles.formGrid}>
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Paciente</label>
                  <select
                    name="patientId"
                    value={form.patientId}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Selecione um paciente</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Data e Hora</label>
                  <input
                    name="scheduledAt"
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Duração (min)</label>
                  <input
                    name="durationMinutes"
                    type="number"
                    min="1"
                    value={form.durationMinutes}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                {modalMode === 'edit' && selected && (
                  <div className={styles.field}>
                    <label>Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                    >
                      <option value="scheduled">Agendado</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                )}
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Anotações</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleFormChange}
                    placeholder="Observações sobre a consulta..."
                    rows={4}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
