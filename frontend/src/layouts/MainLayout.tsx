import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '../components/LanguageSwitcher';

export default function MainLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, padding: 10, alignItems: 'center' }}>
        <Link to="/">{t('nav.dashboard')}</Link>
        <Link to="/profile">{t('nav.profile')}</Link>

        <LanguageSwitcher />

        <button onClick={logout}>{t('nav.logout')}</button>
      </div>

      <hr />

      <Outlet />
    </div>
  );
}