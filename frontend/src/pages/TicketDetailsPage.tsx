import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getTicket, deleteTicket, updateTicketStatus } from '../api/tickets';
import { getMessages } from '../api/messages';
import { socket } from '../socket';

import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';

import { TICKET_STATUS } from '../constants/ticketStatus';
import { getStatusColor } from '../utils/statusColor';

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const role = (() => {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      return JSON.parse(atob(token.split('.')[1](https://blog.logrocket.com/using-hooks-react-router/)))?.role || '';
    } catch {
      return '';
    }
  })();

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
    } catch {
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

  const handleDelete = async () => {
    if (!window.confirm(t('ticket.delete_confirm'))) return;

    try {
      await deleteTicket(String(id));
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>{t('loading')}</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button onClick={() => navigate(-1)}>
          {t('ticket.back')}
        </button>
      </div>

      <h1 style={{ textAlign: 'center', marginTop: 10 }}>
        {ticket.title}
      </h1>

      <p style={{ textAlign: 'center' }}>
        {ticket.description}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '15px 0',
        }}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to={`/tickets/edit/\${ticket.id}`}>
            <button>{t('edit')}</button>
          </Link>
          {role === 'ADMIN' && (
            <button onClick={handleDelete}>
              {t('delete')}
            </button>
          )}
        </div>

        <div>
          {role === 'ADMIN' ? (
            <select
              value={ticket.status}
              onChange={async (e) => {
                const updated = await updateTicketStatus(
                  String(ticket.id),
                  e.target.value
                );
                setTicket(updated);
              }}
            >
              {Object.values(TICKET_STATUS).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <span
              style={{
                background: getStatusColor(ticket.status),
                color: '#fff',
                padding: '4px 8px',
                borderRadius: 6,
              }}
            >
              {ticket.status}
            </span>
          )}
        </div>

        <div style={{ width: 120 }} />
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>{t('ticket.messages')}</h3>
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          <MessageList messages={messages} />
        )}
        <MessageForm ticketId={Number(id)} onMessageSent={loadMessages} />
      </div>
    </div>
  );
}
