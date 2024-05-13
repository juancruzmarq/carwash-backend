import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    description: 'password',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'password must be a string' })
  password?: string;

  @ApiProperty({
    description: 'validated',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'validated must be a boolean' })
  validated?: boolean;
}
