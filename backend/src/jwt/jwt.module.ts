import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    NestJwtModule.register({
      secret: 'secretKey123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtModule {}