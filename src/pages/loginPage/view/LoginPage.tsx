import { useLogin } from '../hooks/useLogin';
import styles from './login.module.css';

export function LoginPage() {
  const { mode, loading, error, form, handleChange, handleSubmit, toggleMode } = useLogin();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>ProntoMed</span>
          <p className={styles.subtitle}>
            {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className={styles.field}>
                <label htmlFor="name">Nome completo</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Dr. João Silva"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="crm">CRM</label>
                <input
                  id="crm"
                  name="crm"
                  type="text"
                  placeholder="CRM/SP 123456"
                  value={form.crm}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="medico@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>
            {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}
          </span>
          <button className={styles.toggle} onClick={toggleMode}>
            {mode === 'login' ? 'Cadastre-se' : 'Fazer login'}
          </button>
        </div>
      </div>
    </div>
  );
}
