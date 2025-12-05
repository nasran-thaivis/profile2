import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class PortfolioService {
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
          portfolio: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } else {
      // Otherwise, look up by username
      user = await this.prisma.user.findUnique({
        where: { username },
        include: {
          portfolio: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.portfolio;
  }

  async create(userId: number, createPortfolioDto: CreatePortfolioDto, file?: Express.Multer.File) {
    const data: any = {
      ...createPortfolioDto,
      userId,
    };

    if (file) {
      const imageUrl = await this.fileUploadService.uploadFile(file, `portfolio/${userId}`);
      data.imageUrl = imageUrl;
    }

    return this.prisma.portfolio.create({
      data,
    });
  }

  async update(id: number, userId: number, updatePortfolioDto: UpdatePortfolioDto, file?: Express.Multer.File) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('You can only edit your own portfolio');
    }

    const updateData: any = { ...updatePortfolioDto };

    if (file) {
      const imageUrl = await this.fileUploadService.uploadFile(file, `portfolio/${userId}`);
      updateData.imageUrl = imageUrl;
    }

    return this.prisma.portfolio.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number, userId: number) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('You can only delete your own portfolio');
    }

    return this.prisma.portfolio.delete({
      where: { id },
    });
  }
}

