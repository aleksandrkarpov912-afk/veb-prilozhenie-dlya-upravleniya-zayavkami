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
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('messages.writeMessage')}
      />

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