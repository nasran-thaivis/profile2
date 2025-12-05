import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('users/:username/profile')
  async getProfile(@Param('username') username: string) {
    return this.profileService.findByUsername(username);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    return this.profileService.update(userId, updateProfileDto, file);
  }

  @Get('profile/theme')
  @UseGuards(JwtAuthGuard)
  async getTheme(@Request() req) {
    const userId = req.user.id;
    return this.profileService.getTheme(userId);
  }

  @Patch('profile/theme')
  @UseGuards(JwtAuthGuard)
  async updateTheme(@Request() req, @Body() theme: Record<string, unknown>) {
    const userId = req.user.id;
    return this.profileService.updateTheme(userId, theme);
  }
}

