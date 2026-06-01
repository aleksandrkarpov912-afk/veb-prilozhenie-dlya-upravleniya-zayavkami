import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import {
  getTicket,
  deleteTicket,
  updateTicketStatus,
} from '../api/tickets';

import { getMessages } from '../api/messages';

import { socket } from '../socket';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Диагностика: логируем id из URL
  useEffect(() => {
    console.log('URL id:', id);
  }, [id]);

  // Валидация ID на раннем этапе
  const tid = Number(id);
  if (!id || !Number.isFinite(tid) || tid <= 0) {
    return <div style={{ padding: 40 }}>Invalid ticket id</div>;
  }

  const token = localStorage.getItem('token');
  let role = '';

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload?.role || '';
    } catch {
      role = '';
    }
  }

  useEffect(() => {
    fetchTicket();
    loadMessages();
  }, [id]);

  useEffect(() => {
    socket.emit('joinTicket', String(id));

    const handler = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('newMessage', handler);

    return () => {
      socket.off('newMessage', handler);
    };
  }, [id]);

  const fetchTicket = async () => {
    try {
      const data = await getTicket(String(id));
      setTicket(data);
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const data = await getMessages(String(id));
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (!ticket) {
    return <div style={{ padding: 40 }}>Ticket not found</div>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <button onClick={() => navigate(-1)}>Back</button>

      <h1>{ticket.title}</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <Link to={`/tickets/${ticket.id}/edit`}>Edit</Link>

        <button
          onClick={async () => {
            const confirmed = confirm('Delete ticket?');
            if (!confirmed) return;

            try {
              await deleteTicket(String(ticket.id));
              navigate('/');
            } catch (err) {
              console.error(err);
            }
          }}
        >
          Delete
        </button>
      </div>

      <p>{ticket.description}</p>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <strong>Status:</strong>{' '}

        {role === 'ADMIN' ? (
          <select
            value={ticket.status}
            onChange={async (e) => {
              try {
                const updated = await updateTicketStatus(
                  String(ticket.id),
                  e.target.value,
                );

                setTicket(updated);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        ) : (
          ticket.status
        )}
      </div>

      <p>
        <strong>Created:</strong>{' '}
        {new Date(ticket.createdAt).toLocaleString()}
      </p>

      {ticket.user && (
        <p>
          <strong>Author:</strong> {ticket.user.email}
        </p>
      )}

      {/* ================= CHAT ================= */}
      <div style={{ marginTop: 40 }}>
        <h3>Messages</h3>

        <MessageList messages={messages} />

        <MessageForm
          ticketId={tid}
          onMessageSent={loadMessages}
        />
      </div>
    </div>
  );
}
