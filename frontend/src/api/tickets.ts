import api from './axios';

const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
};

export const getTickets = async (page = 1, limit = 10) => {
  const role = getRoleFromToken();

  const endpoint = role === 'ADMIN' ? '/tickets' : '/tickets/my';

  const response = await api.get(endpoint, {
    params: { page, limit },
  });

  return response.data;
};

export const createTicket = async (title: string, description: string) => {
  const response = await api.post('/tickets', {
    title,
    description,
  });

  return response.data;
};

export const getTicket = async (id: string) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};

export const updateTicket = async (id: string, title: string, description: string) => {
  const response = await api.patch(`/tickets/${id}`, {
    title,
    description,
  });

  return response.data;
};

export const deleteTicket = async (id: string) => {
  const response = await api.delete(`/tickets/${id}`);
  return response.data;
};

export const updateTicketStatus = async (id: string, status: string) => {
  const response = await api.patch(`/tickets/${id}/status`, {
    status,
  });

  return response.data;
};