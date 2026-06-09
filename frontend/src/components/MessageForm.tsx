import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

export default function MessageForm({
  ticketId,
  onMessageSent,
}: any) {
  const { t } = useTranslation();

  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSend = async () => {
    const tid = Number(ticketId);

    if (!Number.isFinite(tid) || tid <= 0) return;

    const trimmed = text.trim();

    let fileUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await api.post('/messages/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        fileUrl = res.data.url;
      } catch {
        return;
      }
    }

    if (!trimmed && !fileUrl) return;

    const payload: any = {};
    if (trimmed) payload.text = trimmed;
    if (fileUrl) payload.fileUrl = fileUrl;

    await api.post(`/messages/${tid}`, payload);

    setText('');
    setFile(null);
    onMessageSent?.();
  };

  return (
    <div>
      <textarea
  value={text}
  onChange={(e) => {
    if (e.target.value.length <= 1000) {
      setText(e.target.value);
    }
  }}
  placeholder={t('messagesBlock.writeMessage')}
  rows={4}
  maxLength={1000}
  style={{
    width: '100%',
    resize: 'vertical',
    padding: '8px',
    boxSizing: 'border-box',
  }}
/>

<div
  style={{
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
  }}
>
  {text.length}/1000
</div>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleSend}>
        {t('messages.send')}
      </button>
    </div>
  );
}