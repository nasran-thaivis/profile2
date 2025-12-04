import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}

