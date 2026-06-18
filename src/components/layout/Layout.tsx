import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './layout.module.css';

export function Layout() {
  const { doctor, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logo}>ProntoMed</span>
        </div>
        <nav className={styles.nav}>
          <NavLink
            to="/home/patients"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            Pacientes
          </NavLink>
          <NavLink
            to="/home/agenda"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            Agenda
          </NavLink>
        </nav>
      </aside>

      <div className={styles.content}>
        <header className={styles.header}>
          <span className={styles.doctorName}>Dr. {doctor?.name}</span>
          <button className={styles.signOut} onClick={handleSignOut}>
            Sair
          </button>
        </header>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
