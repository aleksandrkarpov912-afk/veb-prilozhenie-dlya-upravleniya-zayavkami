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

  @SubscribeMessage('joinTicket')
  handleJoinTicket(client: Socket, ticketId: string) {
    client.join(`ticket-${ticketId}`);
  }

  @OnEvent('message.created')
  handleMessage(message: any) {
    this.server
      .to(`ticket-${message.ticketId}`)
      .emit('newMessage', message);
  }
}