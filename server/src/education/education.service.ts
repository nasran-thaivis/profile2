import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    // Check if the parameter looks like an email
    const isEmail = username.includes('@');
    
    let user;
    if (isEmail) {
      // If it's an email, look up by email
      user = await this.prisma.user.findUnique({
        where: { email: username },
        include: {
          educations: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } else {
      // Otherwise, look up by username
      user = await this.prisma.user.findUnique({
        where: { username },
        include: {
          educations: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.educations;
  }

  async create(userId: number, createEducationDto: CreateEducationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.education.create({
      data: {
        ...createEducationDto,
        userId,
      },
    });
  }

  async update(id: number, userId: number, updateEducationDto: UpdateEducationDto) {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.userId !== userId) {
      throw new ForbiddenException('You can only update your own education records');
    }

    return this.prisma.education.update({
      where: { id },
      data: updateEducationDto,
    });
  }

  async remove(id: number, userId: number) {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.userId !== userId) {
      throw new ForbiddenException('You can only delete your own education records');
    }

    return this.prisma.education.delete({
      where: { id },
    });
  }
}

