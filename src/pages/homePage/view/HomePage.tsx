import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './home.module.css';

export function HomePage() {
  const { doctor, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>ProntoMed</span>
        <button className={styles.signOut} onClick={handleSignOut}>
          Sair
        </button>
      </header>

      <main className={styles.main}>
        <h1 className={styles.greeting}>
          Olá, <span>Dr. {doctor?.name}</span>
        </h1>
        <p className={styles.sub}>Bem-vindo ao ProntoMed. O seu sistema de prontuário eletrônico.</p>
      </main>
    </div>
  );
}
