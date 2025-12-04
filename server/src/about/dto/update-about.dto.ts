import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class AboutBlockDto {
  @IsString()
  id: string;

  @IsEnum(['text', 'skills', 'achievements', 'timeline', 'stats', 'image'])
  type: 'text' | 'skills' | 'achievements' | 'timeline' | 'stats' | 'image';

  @IsObject()
  data: any;
}

export class UpdateAboutDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutBlockDto)
  blocks?: AboutBlockDto[];
}

