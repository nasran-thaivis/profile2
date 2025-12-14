import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ReorderEducationDto } from './dto/reorder-education.dto';

@Controller()
export class EducationController {
  constructor(private educationService: EducationService) {}

  @Get('users/:username/educations')
  async getEducations(@Param('username') username: string) {
    return this.educationService.findByUsername(username);
  }

  @Post('educations')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createEducationDto: CreateEducationDto) {
    return this.educationService.create(req.user.id, createEducationDto);
  }

  @Patch('educations/reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Request() req, @Body() reorderDto: ReorderEducationDto) {
    if (!reorderDto?.items || !Array.isArray(reorderDto.items) || reorderDto.items.length === 0) {
      throw new BadRequestException('Items array is required and must not be empty');
    }
    
    // Validate each item has required fields
    for (const item of reorderDto.items) {
      if (!item.id || typeof item.order !== 'number' || item.order < 0) {
        throw new BadRequestException('Each item must have a valid id and order (non-negative number)');
      }
    }
    
    return this.educationService.reorder(req.user.id, reorderDto.items);
  }

  @Patch('educations/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Param('id') id: string, @Body() updateEducationDto: UpdateEducationDto) {
    return this.educationService.update(+id, req.user.id, updateEducationDto);
  }

  @Delete('educations/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('id') id: string) {
    return this.educationService.remove(+id, req.user.id);
  }

  @Post('educations/upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif|webp)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const imageUrl = await this.educationService.uploadImage(userId, file);
    return { url: imageUrl };
  }
}

