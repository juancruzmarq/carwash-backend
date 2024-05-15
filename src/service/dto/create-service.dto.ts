import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
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
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

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
  @IsNotEmpty({
    message: 'Price is required',
  })
  price: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the carwash',
  })
  @IsNumber(
    {},
    {
      message: 'Carwash must be a number',
    },
  )
  @IsNotEmpty({
    message: 'Carwash is required',
  })
  carwash: number;
}
