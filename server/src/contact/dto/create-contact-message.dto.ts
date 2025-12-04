import { IsString, IsEmail, IsInt, MinLength } from 'class-validator';

export class CreateContactMessageDto {
  @IsInt()
  userId: number;

  @IsString()
  @MinLength(1)
  senderName: string;

  @IsEmail()
  senderEmail: string;

  @IsString()
  @MinLength(1)
  message: string;
}

