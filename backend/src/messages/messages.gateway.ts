import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

const FRONTEND = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

@WebSocketGateway({
  cors: {
    origin: FRONTEND,
    credentials: true,
  },

  // ❌ ВАЖНО: НЕ задаём transports вручную
  // Railway сам выбирает лучший транспорт
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('SOCKET CONNECTED:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('SOCKET DISCONNECTED:', client.id);
  }

  @SubscribeMessage('joinTicket')
  handleJoinTicket(client: Socket, ticketId: string) {
    client.join(`ticket-${ticketId}`);
  }

  sendMessage(ticketId: number, message: any) {
    this.server.to(`ticket-${ticketId}`).emit('newMessage', message);
  }
}