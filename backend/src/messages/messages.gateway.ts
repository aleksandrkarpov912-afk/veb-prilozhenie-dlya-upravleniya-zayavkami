import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  },
  transports: ['websocket'],
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('WS CONNECT:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('WS DISCONNECT:', client.id);
  }

  // ✅ FIX: payload объект вместо string
  @SubscribeMessage('joinTicket')
  handleJoinTicket(
    client: Socket,
    payload: { ticketId: string },
  ) {
    if (!payload?.ticketId) return;

    client.join(`ticket-${payload.ticketId}`);
  }

  // ✅ FIX: типизация event
  @OnEvent('message.created')
  handleMessage(message: {
    id: string;
    ticketId: string;
    text: string;
    createdAt?: Date;
  }) {
    if (!message?.ticketId) return;

    this.server
      .to(`ticket-${message.ticketId}`)
      .emit('newMessage', message);
  }
}