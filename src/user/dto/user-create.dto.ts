import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({
    description: 'email of the user',
    type: String,
  })
  @IsEmail({ allow_display_name: true }, { message: 'must be an email valid' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    description: 'password of the user',
    type: String,
  })
  @IsNotEmpty({ message: 'the password is required' })
  @IsString({ message: 'must be a string' })
  password: string;
}
