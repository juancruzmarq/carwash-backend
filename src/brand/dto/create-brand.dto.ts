import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    description: 'The name of the brand',
    type: 'string',
    maxLength: 20,
  })
  @IsString({
    message: 'The brand name must be a string',
  })
  @MaxLength(20, {
    message: 'The brand name must be less than 20 characters',
  })
  name: string;
}
