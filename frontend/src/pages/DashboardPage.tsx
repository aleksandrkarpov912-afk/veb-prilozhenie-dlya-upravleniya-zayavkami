import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getTickets } from '../api/tickets';
import type { Ticket } from '../types/ticket';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
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
    <div
      style={{
        padding: 40,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h1>Dashboard</h1>

        <div
          style={{
            display: 'flex',
            gap: 10,
          }}
        >
          <Link to="/tickets/create">
            Create Ticket
          </Link>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
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
                Status: {ticket.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}