import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotDto {
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail(
    {},
    {
      message: 'email must be a valid email',
    },
  )
  email: string;

  @IsNotEmpty({ message: 'redirect url is required' })
  @IsString({ message: 'redirect url must be a string' })
  redirect_url: string;
}
