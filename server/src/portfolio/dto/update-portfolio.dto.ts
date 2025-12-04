import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdatePortfolioDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}

