import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

// Local files
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { Response, Status } from '../common/types/response.type';
import { RefreshDto } from './dto/refresh.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { RestoreDto } from './dto/restore-password.dto';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { SignupDto } from './dto/signup.dto';
import { exclude } from 'src/common/utils/exclude';
import { TokenService } from 'src/token/token.service';
import { Config } from 'src/common/config';
import { UserWithoutPassword } from 'src/user/types/userWithoutPassword.type';
import { errorHandler } from 'src/common/utils/errorHandler';
import { ForgotDto } from './dto/forgot-password.dto';

export interface SinginResponse {
  user: UserWithoutPassword;
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private base_url: string;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailer: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.base_url = this.configService.get<string>(Config.BASE_URL);
  }

  /**
   * Sign in a user
   * @param data
   * @returns user, access_token, refresh_token
   */
  async signIn(data: LoginDto): Promise<Response<SinginResponse>> {
    try {
      const user = await this.userService.findByEmail(data.email);
      if (!user || !user.validated) {
        throw new HttpException(
          'User or password incorrect',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isMatch = await this.userService.comparePassword(
        data.password,
        user.password,
      );

      if (!isMatch) {
        throw new HttpException(
          'User or password incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Token de acceso
      const access_token = await this.tokenService.createAccessToken(
        user,
        60 * 15, // 15 minutos
      );
      const refreshToken = await this.tokenService.createRefreshToken(user, 24); // 24 horas

      const userWithoutPassword = exclude(user, ['password']);

      return {
        status: Status.SUCCESS,
        message: 'User logged in successfully',
        data: {
          user: userWithoutPassword,
          access_token,
          refresh_token: refreshToken.token,
        },
      };
    } catch (error) {
      throw errorHandler(this.logger, error, 'Error on login');
    }
  }

  async signUp(data: SignupDto): Promise<Response<UserWithoutPassword>> {
    try {
      const { email, password } = data;

      const alreadyExists =
        await this.userService.findByEmailAndDeleteIfNot(email);

      if (alreadyExists) {
        throw new HttpException(
          'There is already a user with that email',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { data: user } = await this.userService.create({
        email,
        password,
      });

      try {
        const token_validation = await this.tokenService.createNewUserToken(
          user,
          1,
        ); // 1 hora

        const url = new URL(this.base_url);
        url.pathname = 'signup/verify';
        url.searchParams.append('token', token_validation.token);

        const emailOptions: ISendMailOptions = {
          to: data.email,
          subject: 'Confirma tu cuenta de Adminzee',
          template: './signup',
          context: {
            url,
          },
        };

        await this.mailer.send(emailOptions);

        return {
          status: Status.SUCCESS,
          message: 'User created, please validate your email',
          data: user,
        };
      } catch (error) {
        await this.userService.delete(user.idUser);
        throw errorHandler(this.logger, error, 'error on signup');
      }
    } catch (error) {
      throw errorHandler(this.logger, error, 'error on signup');
    }
  }

  async refresh(data: RefreshDto): Promise<
    Response<{
      access_token: string;
      refresh_token: string;
    }>
  > {
    try {
      const tokens = await this.tokenService.createTokens(data.refresh_token);

      return {
        status: Status.SUCCESS,
        message: 'Token refreshed successfully',
        data: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token.token,
        },
      };
    } catch (error) {
      throw errorHandler(this.logger, error, 'Error on refresh token');
    }
  }

  async logout(id: number): Promise<Response<null>> {
    try {
      await this.tokenService.logout(id);

      return {
        status: Status.SUCCESS,
        message: 'User logged out successfully',
        data: null,
      };
    } catch (error) {
      throw errorHandler(this.logger, error, 'Error on logout');
    }
  }

  async forgotPassword(data: ForgotDto): Promise<Response<null>> {
    try {
      const user = await this.userService.findByEmail(data.email);

      if (!user) {
        throw new HttpException(
          'There is no user with that email',
          HttpStatus.BAD_REQUEST,
        );
      }

      const token = await this.tokenService.createForgotPasswordToken(user);

      const url = new URL(this.base_url);
      url.pathname = 'recover/password';
      url.searchParams.append('token', token.token);

      const emailOptions: ISendMailOptions = {
        to: user.email,
        subject: 'Restablece tu contraseña de Adminzee',
        template: './restore',
        context: {
          url,
        },
      };

      await this.mailer.send(emailOptions);

      return {
        status: Status.SUCCESS,
        message: 'Email sent successfully',
        data: null,
      };
    } catch (error) {}
  }

  async restorePassword(
    token: string,
    data: RestoreDto,
  ): Promise<Response<null>> {
    try {
      const isValid =
        await this.tokenService.validateForgotPasswordToken(token);

      await this.userService.update(isValid.idUser, {
        password: data.password,
      });

      return {
        status: Status.SUCCESS,
        message: 'Password updated successfully',
        data: null,
      };
    } catch (error) {}
  }
}
