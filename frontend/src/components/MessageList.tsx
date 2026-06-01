export default function MessageList({ messages }: any) {
  if (!messages?.length) {
    return <div style={{ marginBottom: 20 }}>No messages yet</div>;
  }

  return (
    <div style={{ marginBottom: 20 }}>
      {messages.map((m: any) => (
        <div key={m.id} style={{ marginBottom: 12, padding: '8px', border: '1px solid #eee', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <b>{m.user?.email || 'Unknown'}</b>
            <span style={{ fontSize: '0.8em', color: '#666' }}>
              {new Date(m.createdAt).toLocaleString()}
            </span>
          </div>

          {m.text && (
            <div style={{ marginBottom: '8px' }}>
              <span>{m.text}</span>
            </div>
          )}

          {m.fileUrl && (
            <div>
              <a
                href={m.fileUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: '#333',
                }}
              >
                📎 Download file
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
