import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text: string;

  @IsNumber()
  ticketId: number;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}