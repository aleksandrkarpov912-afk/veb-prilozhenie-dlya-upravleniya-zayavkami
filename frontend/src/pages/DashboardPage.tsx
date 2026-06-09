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

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchTickets = async (p = page) => {
    try {
      const data = await getTickets(p, limit);
      setTickets(data.items);
      setTotal(data.total);
      setPage(data.page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1);
  }, []);

  const nextPage = () => {
    const maxPage = Math.ceil(total / limit);
    if (page < maxPage) {
      fetchTickets(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      fetchTickets(page - 1);
    }
  };

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
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tickets.map((ticket) => (
              <div key={ticket.id} style={{ border: '1px solid #ccc', padding: 16 }}>
                <Link to={`/tickets/${ticket.id}`}>
                  <h3>{ticket.title}</h3>
                </Link>

                <p>{ticket.description}</p>

                <p>
                  {t('status')}: {getStatusLabel(t, ticket.status)}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={prevPage} disabled={page === 1}>
              Prev
            </button>

            <span>
              {page} / {Math.ceil(total / limit) || 1}
            </span>

            <button
              onClick={nextPage}
              disabled={page >= Math.ceil(total / limit)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}