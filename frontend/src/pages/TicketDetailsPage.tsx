return (
  <div
    style={{
      padding: 40,
      maxWidth: 900,
      margin: '0 auto',
      textAlign: 'center',
    }}
  >
    <button onClick={() => navigate(-1)}>
      {t('ticket.back')}
    </button>

    <h1
      style={{
        marginTop: 20,
        marginBottom: 30,
        fontSize: 64,
        fontWeight: 700,
      }}
    >
      {ticket.title}
    </h1>

    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        gap: 10,
        marginBottom: 20,
      }}
    >
      <Link to={`/tickets/${ticket.id}/edit`}>
        <button>{t('edit')}</button>
      </Link>

      {role === 'ADMIN' && (
        <button onClick={handleDelete}>
          {t('delete')}
        </button>
      )}
    </div>

    <p
      style={{
        marginBottom: 30,
        fontSize: 28,
      }}
    >
      {ticket.description}
    </p>

    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
      }}
    >
      <strong>{t('ticket.status')}:</strong>

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
            padding: '4px 8px',
            borderRadius: 6,
          }}
        >
          {ticket.status}
        </span>
      )}
    </div>

    <div
      style={{
        marginBottom: 40,
        fontSize: 18,
      }}
    >
      <div>
        <strong>Создан:</strong>{' '}
        {ticket.createdAt
          ? new Date(ticket.createdAt).toLocaleString('ru-RU')
          : '-'}
      </div>

      <div style={{ marginTop: 8 }}>
        <strong>Автор:</strong>{' '}
        {ticket.user?.email || ticket.author?.email || '-'}
      </div>
    </div>

    <div style={{ marginTop: 40 }}>
      <h3>{t('ticket.messages')}</h3>

      <MessageList messages={messages} />

      <MessageForm
        ticketId={Number(id)}
        onMessageSent={loadMessages}
      />
    </div>
  </div>
);