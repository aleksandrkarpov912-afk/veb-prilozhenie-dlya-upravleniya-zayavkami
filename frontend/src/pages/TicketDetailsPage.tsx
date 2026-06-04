import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  getTicket,
  deleteTicket,
  updateTicketStatus,
} from '../api/tickets';

import { getMessages } from '../api/messages';
import { socket } from '../socket';

import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';

import { getStatusLabel } from '../utils/status';

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tid = Number(id);

  if (!id || !Number.isFinite(tid)) {
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
    return <div style={{ padding: 40 }}>{t('loading')}</div>;
  }

  if (!ticket) {
    return <div style={{ padding: 40 }}>Ticket not found</div>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <button onClick={() => navigate(-1)}>
        {t('ticket.back')}
      </button>

      <h1>{ticket.title}</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <Link to={`/tickets/${ticket.id}/edit`}>
          {t('ticket.edit')}
        </Link>

        <button
          onClick={async () => {
            const confirmed = confirm(t('ticket.delete_confirm'));
            if (!confirmed) return;

            await deleteTicket(String(ticket.id));
            navigate('/');
          }}
        >
          {t('ticket.delete')}
        </button>
      </div>

      <p>{ticket.description}</p>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <strong>{t('ticket.status')}:</strong>{' '}

        {role === 'ADMIN' ? (
          <select
            value={ticket.status}
            onChange={async (e) => {
              const updated = await updateTicketStatus(
                String(ticket.id),
                e.target.value,
              );

              setTicket(updated);
            }}
          >
            <option value="OPEN">{t('statusValues.OPEN')}</option>
            <option value="IN_PROGRESS">{t('statusValues.IN_PROGRESS')}</option>
            <option value="CLOSED">{t('statusValues.CLOSED')}</option>
            <option value="REJECTED">{t('statusValues.REJECTED')}</option>
          </select>
        ) : (
          getStatusLabel(t, ticket.status)
        )}
      </div>

      <p>
        <strong>{t('ticket.created')}:</strong>{' '}
        {new Date(ticket.createdAt).toLocaleString()}
      </p>

      {ticket.user && (
        <p>
          <strong>{t('ticket.author')}:</strong> {ticket.user.email}
        </p>
      )}

      <div style={{ marginTop: 40 }}>
        <h3>{t('ticket.messages')}</h3>

        <MessageList messages={messages} />

        <MessageForm ticketId={tid} onMessageSent={loadMessages} />
      </div>
    </div>
  );
}