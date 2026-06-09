import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getTicket, updateTicket } from '../api/tickets';

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 3000;

export default function EditTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      if (!id) return;

      const data = await getTicket(id);

      setTitle(data.title);
      setDescription(data.description);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!id) return;

      await updateTicket(id, title, description);

      navigate(`/tickets/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        {t('loading')}
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>{t('edit')}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('title')}
          />
          <div style={{ fontSize: 12 }}>
            {title.length}/{TITLE_MAX}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <textarea
            value={description}
            maxLength={DESCRIPTION_MAX}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('description')}
            rows={8}
          />
          <div style={{ fontSize: 12 }}>
            {description.length}/{DESCRIPTION_MAX}
          </div>
        </div>

        <button
          type="submit"
          style={{ marginTop: 20 }}
        >
          {t('save')}
        </button>
      </form>
    </div>
  );
}
