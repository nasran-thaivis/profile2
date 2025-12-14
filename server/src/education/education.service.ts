import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class EducationService {
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
          educations: true,
        },
      });
    } else {
      // Otherwise, look up by username
      user = await this.prisma.user.findUnique({
        where: { username },
        include: {
          educations: true,
        },
      });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Sort manually to handle null startDate
    return user.educations.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }

  async create(userId: number, createEducationDto: CreateEducationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Auto-assign order if not provided
    let order = createEducationDto.order;
    if (order === undefined) {
      const maxOrder = await this.prisma.education.findFirst({
        where: { userId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = maxOrder ? maxOrder.order + 1 : 0;
    }

    // Set default type if not provided
    const type = createEducationDto.type || 'EDUCATION';

    const data: any = {
      type: type as 'EDUCATION' | 'WORK' | 'INTERNSHIP' | 'CERTIFICATE',
      institution: createEducationDto.institution,
      degree: createEducationDto.degree,
      field: createEducationDto.field,
      startDate: createEducationDto.startDate ? new Date(createEducationDto.startDate) : null,
      endDate: createEducationDto.endDate ? new Date(createEducationDto.endDate) : null,
      order,
      period: createEducationDto.period,
      location: createEducationDto.location,
      description: createEducationDto.description,
      gpa: createEducationDto.gpa,
      skills: createEducationDto.skills,
      imageUrl: createEducationDto.imageUrl,
      userId,
    };

    return this.prisma.education.create({
      data,
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

    // Convert date strings to Date objects if provided
    const updateData: any = { ...updateEducationDto };
    if (updateEducationDto.startDate !== undefined) {
      updateData.startDate = updateEducationDto.startDate ? new Date(updateEducationDto.startDate) : null;
    }
    if (updateEducationDto.endDate !== undefined) {
      updateData.endDate = updateEducationDto.endDate ? new Date(updateEducationDto.endDate) : null;
    }

    return this.prisma.education.update({
      where: { id },
      data: updateData,
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

  async reorder(userId: number, items: { id: string; order: number }[]) {
    if (!items || items.length === 0) {
      throw new NotFoundException('No items provided for reordering');
    }

    // Validate all items belong to the user
    const itemIds = items.map(item => parseInt(item.id)).filter(id => !isNaN(id));
    
    if (itemIds.length === 0) {
      throw new NotFoundException('Invalid item IDs provided');
    }

    const existingItems = await this.prisma.education.findMany({
      where: {
        id: { in: itemIds },
        userId,
      },
    });

    if (existingItems.length !== items.length) {
      throw new ForbiddenException('Some items do not belong to you or do not exist');
    }

    // Use transaction to update all orders atomically
    try {
      const updatedItems = await this.prisma.$transaction(
        items.map(item =>
          this.prisma.education.update({
            where: { id: parseInt(item.id) },
            data: { order: item.order },
          })
        )
      );

      return updatedItems;
    } catch (error) {
      console.error('Reorder transaction error:', error);
      throw new Error('Failed to reorder items');
    }
  }

  async uploadImage(userId: number, file: Express.Multer.File): Promise<string> {
    return this.fileUploadService.uploadFile(file, `education/${userId}`);
  }
}

