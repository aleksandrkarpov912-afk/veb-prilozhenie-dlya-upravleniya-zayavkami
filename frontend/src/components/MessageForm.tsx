import { useState } from 'react';
import api from '../api/axios';

export default function MessageForm({
  ticketId,
  onMessageSent,
}: any) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSend = async () => {
    console.log('ticketId:', ticketId);

    const tid = Number(ticketId);

    if (!Number.isFinite(tid) || tid <= 0) {
      console.error('Invalid ticketId:', ticketId);
      return;
    }

    const trimmed = text.trim();

    let fileUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        console.log('Starting file upload...', {
          fileName: file.name,
          fileSize: file.size,
        });

        const res = await api.post('/messages/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        fileUrl = res.data.url;
        console.log('File uploaded successfully:', fileUrl);
      } catch (uploadErr) {
        console.error('File upload failed:', uploadErr);
        return;
      }
    }

    // Проверка: хотя бы одно поле должно быть заполнено
    if (!trimmed && !fileUrl) {
      console.log('Empty message blocked on frontend');
      return;
    }

    const payload: any = {};
    if (trimmed) payload.text = trimmed;
    if (fileUrl) payload.fileUrl = fileUrl;

    try {
      console.log('Sending message:', { ticketId: tid, payload });
      await api.post(`/messages/${tid}`, payload);
      setText('');
      setFile(null);
      onMessageSent?.();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write message..."
      />
      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
