import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  async findByUsername(username: string) {
    // Check if the parameter looks like an email
    const isEmail = username.includes('@');
    
    let user;
    if (isEmail) {
      // If it's an email, look up by email
      user = await this.prisma.user.findUnique({
        where: { email: username },
        include: {
          profile: true,
        },
      });
    } else {
      // Otherwise, look up by username
      user = await this.prisma.user.findUnique({
        where: { username },
        include: {
          profile: true,
        },
      });
    }

    if (!user || !user.profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      ...user.profile,
      userId: user.id,
      username: user.username, // Include username for redirect purposes
    };
  }

  async update(userId: number, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const updateData: any = { ...updateProfileDto };

    if (file) {
      const avatarUrl = await this.fileUploadService.uploadFile(file, `avatars/${userId}`);
      updateData.avatarUrl = avatarUrl;
    }

    return this.prisma.profile.update({
      where: { userId },
      data: updateData,
    });
  }

  async verifyOwnership(userId: number, profileUserId: number) {
    if (userId !== profileUserId) {
      throw new ForbiddenException('You can only edit your own profile');
    }
  }

  async getTheme(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { theme: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile.theme || {};
  }

  async updateTheme(userId: number, theme: Record<string, unknown>) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.profile.update({
      where: { userId },
      data: { theme: theme as Prisma.InputJsonValue },
    });
  }
}

