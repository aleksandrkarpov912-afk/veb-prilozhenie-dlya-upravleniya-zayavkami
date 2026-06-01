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
  'https://veb-prilozhenie-dlya-upravleniya-za-pi.vercel.app',
].filter(Boolean);

@WebSocketGateway({
  cors: {
    origin: FRONTEND,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  path: '/socket.io', // ✅ ЯВНО ЗАДАННЫЙ PATH
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinTicket')
  handleJoinTicket(client: Socket, ticketId: string) {
    client.join(`ticket-${ticketId}`);
  }

  sendMessage(ticketId: number, message: any) {
    this.server.to(`ticket-${ticketId}`).emit('newMessage', message);
  }
}