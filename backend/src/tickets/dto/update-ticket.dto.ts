import { IsEnum, IsOptional } from 'class-validator';

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
}

export class UpdateTicketDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}