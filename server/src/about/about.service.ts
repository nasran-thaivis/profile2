import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        about: true,
      },
    });

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

    return this.prisma.about.update({
      where: { userId },
      data: updateAboutDto,
    });
  }

  async verifyOwnership(userId: number, aboutUserId: number) {
    if (userId !== aboutUserId) {
      throw new ForbiddenException('You can only edit your own about section');
    }
  }
}

