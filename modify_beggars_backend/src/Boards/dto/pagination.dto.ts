import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ type: Number, required: true, description: '페이지수' })
  @IsNotEmpty()
  @IsOptional()
  public page: number;

  @ApiProperty({ type: Number, required: true, description: '데이터 개수' })
  @IsNotEmpty()
  @IsOptional()
  public limit: number;

  public boardTypes: number;
} 
