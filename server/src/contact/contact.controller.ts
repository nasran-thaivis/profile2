import { Controller, Post, Get, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Controller()
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post('contact')
  async create(@Body() createContactMessageDto: CreateContactMessageDto) {
    return this.contactService.create(createContactMessageDto);
  }

  @Get('contact/:userId')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Request() req, @Param('userId') userId: string) {
    // Only allow users to see their own messages
    if (req.user.id !== +userId) {
      throw new ForbiddenException('You can only view your own messages');
    }
    return this.contactService.findByUserId(+userId);
  }

  @Get('contact')
  @UseGuards(JwtAuthGuard)
  async getMyMessages(@Request() req) {
    // Get messages for the authenticated user
    return this.contactService.findByUserId(req.user.id);
  }
}

