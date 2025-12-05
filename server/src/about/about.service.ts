import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class AboutService {
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
          about: true,
        },
      });
    } else {
      // Otherwise, look up by username
      user = await this.prisma.user.findUnique({
        where: { username },
        include: {
          about: true,
        },
      });
    }

    if (!user || !user.about) {
      throw new NotFoundException('About not found');
    }

    return user.about;
  }

  async update(userId: number, updateAboutDto: UpdateAboutDto) {
    const about = await this.prisma.about.findUnique({
      where: { userId },
    });

    if (!about) {
      throw new NotFoundException('About not found');
    }

    // Prepare update data
    const updateData: any = {};
    
    if (updateAboutDto.content !== undefined) {
      updateData.content = updateAboutDto.content;
    }
    
    if (updateAboutDto.blocks !== undefined) {
      // Prisma will automatically serialize JSON
      updateData.blocks = updateAboutDto.blocks;
    }

    return this.prisma.about.update({
      where: { userId },
      data: updateData,
    });
  }

  async uploadImage(userId: number, file: Express.Multer.File): Promise<string> {
    return this.fileUploadService.uploadFile(file, `about/${userId}`);
  }

  async verifyOwnership(userId: number, aboutUserId: number) {
    if (userId !== aboutUserId) {
      throw new ForbiddenException('You can only edit your own about section');
    }
  }
}

