import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { createTicket } from '../api/tickets';

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      await createTicket(title, description);

      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || t('create_ticket_failed'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>{t('createTicket')}</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: 400,
        }}
      >
        <input
          type="text"
          placeholder={t('title')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder={t('description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button disabled={loading}>
          {loading ? t('loading') : t('create')}
        </button>
      </form>
    </div>
  );
}