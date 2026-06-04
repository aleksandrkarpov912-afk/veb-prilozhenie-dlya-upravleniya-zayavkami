import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getTickets } from '../api/tickets';
import type { Ticket } from '../types/ticket';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h1>{t('dashboard')}</h1>

        <div style={{ display: 'flex', gap: 10 }}>
          <LanguageSwitcher />

          <Link to="/tickets/create">
            {t('createTicket')}
          </Link>

          <button onClick={logout}>
            {t('logout')}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p>{t('loading')}</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              style={{
                border: '1px solid #ccc',
                padding: 16,
              }}
            >
              <Link to={`/tickets/${ticket.id}`}>
                <h3>{ticket.title}</h3>
              </Link>

              <p>{ticket.description}</p>

              <p>
                {t('status')}: {ticket.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}