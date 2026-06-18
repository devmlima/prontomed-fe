import { createContext, useContext, useState, type ReactNode } from 'react';

interface Doctor {
  id: string;
  name: string;
  email: string;
  crm: string;
}

interface AuthContextValue {
  doctor: Doctor | null;
  signIn: (token: string, doctor: Doctor) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(() => {
    const stored = localStorage.getItem('doctor');
    return stored ? JSON.parse(stored) : null;
  });

  function signIn(token: string, doctor: Doctor) {
    localStorage.setItem('token', token);
    localStorage.setItem('doctor', JSON.stringify(doctor));
    setDoctor(doctor);
  }

  function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('doctor');
    setDoctor(null);
  }

  return (
    <AuthContext.Provider value={{ doctor, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
