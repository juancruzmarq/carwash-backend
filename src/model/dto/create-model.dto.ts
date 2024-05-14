import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateModelDto {
  @ApiProperty({
    description: 'The name of the model',
    type: 'string',
    maxLength: 20,
  })
  @IsString({
    message: 'The model name must be a string',
  })
  @MaxLength(20, {
    message: 'The model name must be less than 20 characters',
  })
  name: string;

  @ApiProperty({
    description: 'The model ID',
    type: 'number',
  })
  @IsInt({
    message: 'The model ID must be a number',
  })
  @IsNotEmpty({
    message: 'The model ID is required',
  })
  idBrand: number;
}
