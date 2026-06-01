import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private service: MessagesService) {}

  // 🔔 ВАЖНО: upload идёт ПЕРЕД :ticketId
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File missing');
    }

    console.log('File uploaded:', {
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
    });

    return {
      url: `http://localhost:3000/uploads/${file.filename}`,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':ticketId')
  create(
    @Req() req,
    @Param('ticketId') ticketId: string,
    @Body() body: any,
  ) {
    const tid = Number(ticketId);

    if (!Number.isFinite(tid) || tid <= 0) {
      throw new BadRequestException('Invalid ticketId');
    }

    const text = typeof body?.text === 'string'
      ? body.text.trim()
      : '';
    const fileUrl = body?.fileUrl ?? null;

    if (!text && !fileUrl) {
      throw new BadRequestException('Message cannot be empty');
    }

    return this.service.create(
      tid,
      req.user.id,
      text,
      fileUrl,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':ticketId')
  find(@Param('ticketId') ticketId: string) {
    const tid = Number(ticketId);

    if (!Number.isFinite(tid) || tid <= 0) {
      throw new BadRequestException('Invalid ticketId');
    }

    return this.service.findByTicket(tid);
  }
}
