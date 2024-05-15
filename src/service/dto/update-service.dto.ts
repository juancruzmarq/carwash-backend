import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateServiceDto {
  @ApiProperty({
    example: 'Cleaning',
    description: 'The name of the service',
  })
  @IsString({
    message: 'Name must be a string',
  })
  @MaxLength(50, {
    message: 'Name is too long',
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'This service is for...',
    description: 'The description of the service',
  })
  @IsString({
    message: 'Description must be a string',
  })
  @MaxLength(100, {
    message: 'Description is too long',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '200',
    description: 'The price of the service',
  })
  @IsNumber(
    {},
    {
      message: 'Price must be a number',
    },
  )
  @IsOptional()
  price?: number;
}
