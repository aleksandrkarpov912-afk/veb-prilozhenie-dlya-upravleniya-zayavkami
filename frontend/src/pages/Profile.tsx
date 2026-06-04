import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getMe, updateProfile } from '../api/user';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Profile() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMe();

        setForm({
          name: res.data.name ?? '',
          email: res.data.email ?? '',
          password: '',
        });
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const handleUpdate = async () => {
    if (!form.name.trim() || !form.email.trim()) return;

    setLoading(true);

    try {
      const payload: any = {
        name: form.name,
        email: form.email,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      await updateProfile(payload);

      setForm((prev) => ({
        ...prev,
        password: '',
      }));

      alert(t('profile.updated'));
    } catch (e) {
      console.error(e);
      alert(t('profile.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <LanguageSwitcher />
      </div>

      <h2>{t('profile.title')}</h2>

      <input
        placeholder={t('profile.name')}
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        placeholder={t('profile.email')}
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        placeholder={t('profile.password')}
        type="password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button onClick={handleUpdate} disabled={loading}>
        {t('profile.save')}
      </button>
    </div>
  );
}