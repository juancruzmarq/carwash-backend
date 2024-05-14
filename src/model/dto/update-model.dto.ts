import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateModelto {
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
}
