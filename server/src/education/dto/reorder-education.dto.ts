import { IsArray, ValidateNested, IsString, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ReorderItemDto {
  @Transform(({ value }) => String(value))
  @IsString()
  @IsNotEmpty()
  id: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderEducationDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}

