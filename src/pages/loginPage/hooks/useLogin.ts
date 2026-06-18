import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../contexts/AuthContext';

type Mode = 'login' | 'register';

export function useLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', crm: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response =
        mode === 'login'
          ? await authService.login({ email: form.email, password: form.password })
          : await authService.register(form);
      signIn(response.token, response.doctor);
      navigate('/home');
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setError('');
  }

  return { mode, loading, error, form, handleChange, handleSubmit, toggleMode };
}
