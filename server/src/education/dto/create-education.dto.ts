import { IsString, IsEnum, IsOptional, IsDateString, IsInt, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export enum EducationType {
  EDUCATION = 'EDUCATION',
  WORK = 'WORK',
  INTERNSHIP = 'INTERNSHIP',
  CERTIFICATE = 'CERTIFICATE',
}

export class CreateEducationDto {
  // userId จะถูกเพิ่มโดย controller จาก req.user.id

  @IsEnum(EducationType)
  @IsOptional()
  type?: EducationType;

  @IsString()
  institution: string;

  @IsString()
  degree: string;

  @IsString()
  @IsOptional()
  field?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string | null;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  period?: string; // deprecated - kept for backward compatibility

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  gpa?: string;

  @IsString()
  @IsOptional()
  skills?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

