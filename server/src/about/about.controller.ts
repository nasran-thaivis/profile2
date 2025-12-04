import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
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
}

