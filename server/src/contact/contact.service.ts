import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(createContactMessageDto: CreateContactMessageDto) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createContactMessageDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.contactMessage.create({
      data: createContactMessageDto,
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.contactMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

