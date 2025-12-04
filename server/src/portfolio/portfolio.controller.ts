import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Controller()
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get('users/:username/portfolio')
  async getPortfolio(@Param('username') username: string) {
    return this.portfolioService.findByUsername(username);
  }

  @Post('portfolio')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Request() req,
    @Body() createPortfolioDto: CreatePortfolioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    return this.portfolioService.create(userId, createPortfolioDto, file);
  }

  @Patch('portfolio/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    return this.portfolioService.update(+id, userId, updatePortfolioDto, file);
  }

  @Delete('portfolio/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.portfolioService.remove(+id, userId);
  }
}

