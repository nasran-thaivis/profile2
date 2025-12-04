import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

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
}

