import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/loginPage/view/LoginPage';
import { Layout } from './components/layout/Layout';
import { PatientsPage } from './pages/patientsPage/view/PatientsPage';
import { AppointmentsPage } from './pages/appointmentsPage/view/AppointmentsPage';
import { type ReactNode } from 'react';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { doctor } = useAuth();
  return doctor ? <>{children}</> : <Navigate to="/" replace />;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { doctor } = useAuth();
  return doctor ? <Navigate to="/home/patients" replace /> : <>{children}</>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="patients" replace />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="agenda" element={<AppointmentsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
