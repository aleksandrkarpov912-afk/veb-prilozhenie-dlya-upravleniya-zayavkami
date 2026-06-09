import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getTickets } from '../api/tickets';
import type { Ticket } from '../types/ticket';
import { getStatusLabel } from '../utils/status';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>{t('dashboard')}</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/tickets/create">{t('createTicket')}</Link>
          <button onClick={logout}>{t('logout')}</button>
        </div>
      </div>

      {loading ? (
        <p>{t('loading')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tickets.map((ticket) => (
            <div key={ticket.id} style={{ border: '1px solid #ccc', padding: 16 }}>
              <Link to={`/tickets/${ticket.id}`}>
                <h3
                  style={{
                    margin: 0,
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-all',
                  }}
                >
                  {ticket.title}
                </h3>
              </Link>

              <p
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {ticket.description}
              </p>

              <p>
                {t('status')}: {getStatusLabel(t, ticket.status)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
