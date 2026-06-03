import { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 40 }}>
        <button onClick={() => setMode('login')} disabled={mode === 'login'}>
          Login
        </button>

        <button onClick={() => setMode('register')} disabled={mode === 'register'}>
          Register
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {mode === 'login' ? (
          <LoginPage switchToRegister={() => setMode('register')} />
        ) : (
          <RegisterPage switchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}