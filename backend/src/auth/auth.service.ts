import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name?: string,
  ) {
    const existingUser =
      await this.prisma.user.findUnique({
        where: { email },
      });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

    const { password: _, ...result } = user;

    return result;
  }

  async login(email: string, password: string) {
    const user =
      await this.prisma.user.findUnique({
        where: { email },
      });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid password');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...result } = user;

    return {
      access_token: token,
      user: result,
    };
  }

  async getMe(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
}