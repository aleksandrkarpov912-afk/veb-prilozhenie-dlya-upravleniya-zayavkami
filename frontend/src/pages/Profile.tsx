import { useEffect, useState } from 'react';
import { getMe, updateProfile } from '../api/user';

export default function Profile() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMe().then((res) => {
      setForm((prev) => ({
        ...prev,
        name: res.data.name,
        email: res.data.email,
      }));
    });
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateProfile(form);
      alert('Профиль обновлён');
    } catch (e) {
      alert('Ошибка обновления');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Профиль</h2>

      <input
        placeholder="Имя"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Новый пароль"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleUpdate} disabled={loading}>
        Сохранить
      </button>
    </div>
  );
}