import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createTicket } from '../api/tickets';

export default function CreateTicketPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      await createTicket(
        title,
        description,
      );

      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Create ticket failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <h1>Create Ticket</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: 400,
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value,
            )
          }
        />

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        <button disabled={loading}>
          {loading
            ? 'Loading...'
            : 'Create'}
        </button>
      </form>
    </div>
  );
}