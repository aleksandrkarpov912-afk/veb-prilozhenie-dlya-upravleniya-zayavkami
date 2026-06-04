import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '../components/LanguageSwitcher';
import api from '../api/axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem(
        'token',
        response.data.access_token,
      );

      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || t('login_failed'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {/* LANGUAGE SWITCHER */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <LanguageSwitcher />
      </div>

      <form
        onSubmit={handleLogin}
        style={{
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* FIXED */}
        <h1>{t('login')}</h1>

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
          {loading ? t('loading') : t('login')}
        </button>

        {/* FIXED LINK */}
        <p style={{ marginTop: 16 }}>
          {t('no_account')} {' '}
          <Link to="/register">
            {t('register')}
          </Link>
        </p>
      </form>
    </div>
  );
}