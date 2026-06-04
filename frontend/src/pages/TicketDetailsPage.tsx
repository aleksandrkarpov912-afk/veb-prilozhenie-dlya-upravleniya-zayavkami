<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
  }}
>
  {/* ЛЕВАЯ ЧАСТЬ — ЗАГОЛОВОК + КНОПКИ */}
  <div>
    <h1 style={{ margin: 0 }}>{ticket.title}</h1>

    <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
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

  {/* ПРАВАЯ ЧАСТЬ — СТАТУС */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <strong>{t('status')}:</strong>

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
</div>