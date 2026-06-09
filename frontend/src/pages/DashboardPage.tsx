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
  const [totalPages, setTotalPages] = useState(1);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchTickets = async (currentPage = 1) => {
    setLoading(true); 
    try {
      const data = await getTickets(currentPage, 10);
      setTickets(data.data);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(page);
  }, [page]);

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>{t('dashboard')}</h1>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/tickets/create">
            {t('createTicket')}
          </Link>
          <button onClick={logout}>
            {t('logout')}
          </button>
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

          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{ cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
            >
              Previous
            </button>

            <span>
              {page} / {totalPages}
            </span>

            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={page === totalPages}
              style={{ cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
