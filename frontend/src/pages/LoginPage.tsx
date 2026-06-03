import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import api from '../api/axios';

export default function LoginPage() {
  const navigate = useNavigate();

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
        err.response?.data?.message ||
          'Login failed',
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
        onSubmit={handleLogin}
        style={{
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        <button disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>

        <p
          style={{
            marginTop: 16,
          }}
        >
          Нет аккаунта?{' '}
          <Link to="/register">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
}
