import { IsString, IsOptional } from 'class-validator';

export class UpdateAboutDto {
  @IsOptional()
  @IsString()
  content?: string;
}

