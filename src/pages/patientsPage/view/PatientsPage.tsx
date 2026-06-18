import { usePatients } from '../hooks/usePatients';
import styles from './patients.module.css';

const GENDER_LABEL: Record<string, string> = {
  M: 'Masculino',
  F: 'Feminino',
  O: 'Outro',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function PatientsPage() {
  const {
    patients, loading, error, saving,
    modalMode, form,
    actionMenuId, setActionMenuId,
    deleteConfirmId, setDeleteConfirmId,
    openCreate, openEdit, closeModal,
    handleFormChange, handleSubmit, handleDelete,
  } = usePatients();

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Pacientes</h1>
        <button className={styles.btnPrimary} onClick={openCreate}>
          + Novo Paciente
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
                <th>Nome</th>
                <th>Data de Nascimento</th>
                <th>Sexo</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.empty}>
                    Nenhum paciente cadastrado
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{formatDate(p.birthDate)}</td>
                    <td>{GENDER_LABEL[p.gender] ?? p.gender}</td>
                    <td>{p.phone}</td>
                    <td className={styles.actionsCell}>
                      {actionMenuId === p.id && (
                        <div
                          className={styles.backdrop}
                          onClick={() => setActionMenuId(null)}
                        />
                      )}
                      <div className={styles.actionsWrapper}>
                        <button
                          className={styles.actionsBtn}
                          onClick={() =>
                            setActionMenuId(actionMenuId === p.id ? null : p.id)
                          }
                        >
                          ···
                        </button>
                        {actionMenuId === p.id && (
                          <div className={styles.dropdown}>
                            <button onClick={() => openEdit(p)}>Editar</button>
                            <button
                              className={styles.dangerItem}
                              onClick={() => {
                                setDeleteConfirmId(p.id);
                                setActionMenuId(null);
                              }}
                            >
                              Excluir
                            </button>
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

      {/* Confirm delete */}
      {deleteConfirmId && (
        <div className={styles.overlay}>
          <div className={styles.confirmCard}>
            <h2>Excluir paciente</h2>
            <p>
              Esta ação é irreversível. Os dados do paciente serão anonimizados
              conforme a LGPD. O histórico de agendamentos será preservado.
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancelar
              </button>
              <button
                className={styles.btnDanger}
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Confirmar exclusão
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
              <h2>{modalMode === 'create' ? 'Novo Paciente' : 'Editar Paciente'}</h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                ×
              </button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Nome completo</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Pedro Lima"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Telefone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>E-mail</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="paciente@email.com"
                  />
                </div>
                <div className={styles.field}>
                  <label>Data de Nascimento</label>
                  <input
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Sexo</label>
                  <select name="gender" value={form.gender} onChange={handleFormChange} required>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Altura (m)</label>
                  <input
                    name="height"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.height}
                    onChange={handleFormChange}
                    placeholder="1.70"
                  />
                </div>
                <div className={styles.field}>
                  <label>Peso (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.weight}
                    onChange={handleFormChange}
                    placeholder="70.0"
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
