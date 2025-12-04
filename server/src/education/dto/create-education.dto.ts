import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum EducationType {
  EDUCATION = 'education',
  INTERNSHIP = 'internship',
}

export class CreateEducationDto {
  // userId จะถูกเพิ่มโดย controller จาก req.user.id

  @IsEnum(EducationType)
  type: EducationType;

  @IsString()
  institution: string;

  @IsString()
  degree: string;

  @IsString()
  @IsOptional()
  field?: string;

  @IsString()
  @IsOptional()
  period?: string;

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
}

