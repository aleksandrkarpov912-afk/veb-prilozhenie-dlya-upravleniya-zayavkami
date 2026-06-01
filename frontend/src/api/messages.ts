import api from "./axios";

export const getMessages = async (ticketId: string) => {
  const res = await api.get(`/messages/${ticketId}`);
  return res.data;
};

export const sendMessage = async (
  ticketId: string,
  text: string,
) => {
  const res = await api.post(`/messages/${ticketId}`, {
    text,
  });

  return res.data;
};