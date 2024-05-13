import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    description: 'refresh_token',
    example: 'refresh_token',
    required: true,
  })
  @IsString({ message: 'refresh_token must be a string' })
  @IsNotEmpty({ message: 'refresh_token is required' })
  refresh_token: string;
}
