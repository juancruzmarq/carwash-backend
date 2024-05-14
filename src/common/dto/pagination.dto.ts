import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    name: 'take',
    description: 'Number of items to take',
  })
  @IsInt({
    message: 'Take must be a number',
  })
  @Min(1)
  @IsOptional()
  take?: number;

  @ApiProperty({
    example: 0,
    name: 'skip',
    description: 'Number of items to skip',
  })
  @IsInt({
    message: 'Skip must be a number',
  })
  @Min(0)
  skip?: number;
}
