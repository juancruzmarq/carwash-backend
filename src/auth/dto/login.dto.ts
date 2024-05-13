import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email' })
  @ApiProperty({
    description: 'email',
    type: String,
    required: true,
  })
  readonly email: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @ApiProperty({
    description: 'password',
    type: String,
    required: true,
  })
  readonly password: string;
}
