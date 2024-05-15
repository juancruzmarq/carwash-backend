import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    type: 'number',
    description: 'The id of the carwash',
    example: 1,
  })
  @IsNotEmpty({ message: 'The id of the carwash is required' })
  @IsNumber(
    {},
    {
      message: 'The id of the carwash must be a number',
    },
  )
  idCarwash: number;

  @ApiProperty({
    type: 'string',
    description: 'A note for the appointment',
    example: 'Please, take care of my car',
  })
  @IsOptional()
  @IsString({ message: 'The note must be a string' })
  note?: string;

  @ApiProperty({
    type: 'Array',
    description: 'The id of the services',
    example: [1, 2],
  })
  @IsNotEmpty({ message: 'The id of the services is required' })
  @IsArray({ message: 'The id of the services must be an array' })
  services: number[];

  @ApiProperty({
    type: 'number',
    description: 'The id of the vehicle',
    example: 1,
  })
  @IsNotEmpty({ message: 'The id of the vehicle is required' })
  @IsNumber(
    {},
    {
      message: 'The id of the vehicle must be a number',
    },
  )
  idVehicle: number;

  @ApiProperty({
    type: 'number',
    description: 'The id of the client',
    example: 1,
  })
  @IsNotEmpty({ message: 'The id of the client is required' })
  @IsNumber(
    {},
    {
      message: 'The id of the client must be a number',
    },
  )
  idClient: number;

  @ApiProperty({
    type: 'number',
    description: 'The id of the promotion',
    example: 1,
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'The id of the promotion must be a number',
    },
  )
  idPromotion?: number;
}
