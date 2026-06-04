return (
  <div style={{ padding: 40, maxWidth: 800, margin: '0 auto', color: '#fff' }}>
    
    {/* HEADER */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button onClick={() => navigate(-1)}>
        {t('ticket.back')}
      </button>

      <div style={{ display: 'flex', gap: 10 }}>
        <Link to={`/tickets/edit/${ticket.id}`}>
          <button>{t('edit')}</button>
        </Link>

        {role === 'ADMIN' && (
          <button onClick={handleDelete}>
            {t('delete')}
          </button>
        )}
      </div>
    </div>

    {/* TITLE */}
    <h1 style={{ textAlign: 'center', marginTop: 20 }}>
      {ticket.title}
    </h1>

    {/* STATUS */}
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
      <strong style={{ marginRight: 10 }}>{t('status')}:</strong>

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
            padding: '4px 10px',
            borderRadius: 6,
          }}
        >
          {ticket.status}
        </span>
      )}
    </div>

    {/* DESCRIPTION */}
    <div style={{ marginTop: 30, textAlign: 'center' }}>
      {ticket.description}
    </div>

    {/* MESSAGES */}
    <div style={{ marginTop: 40 }}>
      <h3 style={{ textAlign: 'center' }}>
        {t('messages')}
      </h3>

      <MessageList messages={messages} />
      <MessageForm ticketId={Number(id)} onMessageSent={loadMessages} />
    </div>

  </div>
);