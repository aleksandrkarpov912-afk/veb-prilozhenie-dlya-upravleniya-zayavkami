import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import api from '../api/axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      navigate('/login');
    } catch (err: any) {
      setError(
        err.response?.data?.message || t('register_failed'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h1>{t('register')}</h1>

        <input
          type="text"
          placeholder={t('name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button disabled={loading}>
          {loading ? t('loading') : t('register')}
        </button>

        <p style={{ marginTop: 16 }}>
          {t('have_account')} {' '}
          <Link to="/login">
            {t('login')}
          </Link>
        </p>
      </form>
    </div>
  );
}