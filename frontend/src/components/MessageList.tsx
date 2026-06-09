import { useTranslation } from 'react-i18next';

export default function MessageList({ messages }: any) {
  const { t } = useTranslation();

  if (!messages?.length) {
    return (
      <div style={{ marginBottom: 20 }}>
        {t('messages.empty')}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 20 }}>
      {messages.map((m: any) => (
        <div
          key={m.id}
          style={{
            marginBottom: 12,
            padding: '8px',
            border: '1px solid #eee',
            borderRadius: '4px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <b>{m.user?.email || t('messages.unknownUser')}</b>

            <span style={{ fontSize: 12, color: '#666' }}>
              {new Date(m.createdAt).toLocaleString()}
            </span>
          </div>

          {m.text && <div>{m.text}</div>}

          {m.fileUrl && (
            <div style={{ marginTop: 8 }}>
              <a href={m.fileUrl} target="_blank" rel="noreferrer">
                📎 {t('messages.downloadFile')}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}