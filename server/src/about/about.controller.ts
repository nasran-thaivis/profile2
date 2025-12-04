import { Controller, Get, Patch, Post, Body, Param, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';

@Controller()
export class AboutController {
  constructor(private aboutService: AboutService) {}

  @Get('users/:username/about')
  async getAbout(@Param('username') username: string) {
    return this.aboutService.findByUsername(username);
  }

  @Patch('about')
  @UseGuards(JwtAuthGuard)
  async updateAbout(@Request() req, @Body() updateAboutDto: UpdateAboutDto) {
    const userId = req.user.id;
    return this.aboutService.update(userId, updateAboutDto);
  }

  @Post('about/upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.id;
    const imageUrl = await this.aboutService.uploadImage(userId, file);
    return { url: imageUrl };
  }
}

