import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RestoreDto {
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail(
    {},
    {
      message: 'email must be a valid email',
    },
  )
  email: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  password: string;
}
