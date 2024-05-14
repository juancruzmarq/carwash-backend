import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCarwashDto {
  @ApiProperty({
    example: 'Carwash user',
  })
  @IsInt({
    message: 'User must be a number',
  })
  @IsNotEmpty({
    message: 'User is required',
  })
  idUser: number;

  @ApiProperty({
    example: 'Carwash Name',
  })
  @IsString({
    message: 'Name must be a string',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @ApiProperty({
    example: 'Carwash Address',
  })
  @IsString({
    message: 'Address must be a string',
  })
  @IsNotEmpty({
    message: 'Address is required',
  })
  address: string;

  @ApiProperty({
    example: 'Carwash Phone',
  })
  @IsString({
    message: 'Phone must be a string',
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'Carwash Email',
  })
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email',
    },
  )
  @IsOptional()
  email: string;

  @ApiProperty({
    example: 'Carwash Capacity',
  })
  @IsInt({
    message: 'Capacity must be a number',
  })
  @IsOptional()
  capacity: number;

  @ApiProperty({
    example: 'Carwash Photo',
  })
  @IsString({
    message: 'Photo must be a string',
  })
  @IsOptional()
  photo: string;
}
