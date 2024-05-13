import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { auth_token, user } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { TokenType } from './types/token.types';
import { errorHandler } from 'src/common/utils/errorHandler';
import { Response, Status } from 'src/common/types/response.type';
import { UserWithoutPassword } from 'src/user/types/userWithoutPassword.type';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Create a refresh token for a user
   * @param user
   * @param expiresHours
   * @returns token_validation
   */
  async createRefreshToken(user: user, expiresHours: number) {
    try {
      this.logger.log(`creating a token for: ${user.email}`);

      const expires = new Date();
      expires.setHours(expires.getHours() + expiresHours);

      const token = await this.jwtService.signAsync(
        { sub: user.idUser, email: user.email },
        { expiresIn: 60 * 60 * expiresHours }, // 1 minuto * 60 = 1 hora * 24 = 1 día
      );

      const refreshToken = await this.prisma.auth_token.create({
        data: {
          user: {
            connect: {
              idUser: user.idUser,
            },
          },
          expireDate: expires,
          token: token,
          tokenType: {
            connectOrCreate: {
              where: { name: TokenType.REFRESH },
              create: { name: TokenType.REFRESH },
            },
          },
        },
      });

      return refreshToken;
    } catch (error) {
      throw errorHandler(this.logger, error, 'Error on create refresh token');
    }
  }

  /**
   * Create an access token for a user
   * @param user
   * @param expiresSeconds
   * @returns token
   */
  async createAccessToken(user: user, expiresSeconds: number) {
    try {
      this.logger.log(`createToken: ${user.email}`);

      const token = await this.jwtService.signAsync(
        { sub: user.idUser, email: user.email },
        { expiresIn: expiresSeconds }, // 1 minuto * 60 = 1 hora * 24 = 1 día
      );

      return token;
    } catch (error) {
      throw errorHandler(this.logger, error, 'Error on create access token');
    }
  }

  /**
   * Get a token
   * @param token
   * @returns token
   */
  async findToken(token: string) {
    try {
      this.logger.log(`findToken: ${token}`);

      const tokenFound = await this.prisma.auth_token.findUnique({
        where: { token: token },
      });

      if (!tokenFound) {
        throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
      }

      return tokenFound;
    } catch (error) {
      throw errorHandler(this.logger, error, 'Error on find token');
    }
  }

  /**
   * Validate a token and return a boolean
   * @param token
   * @returns boolean
   */
  async validateToken(token: string) {
    try {
      this.logger.log(`validateToken: ${token}`);

      const isValid = await this.jwtService.verifyAsync(token);
      if (!isValid) {
        throw new HttpException('token not valid', HttpStatus.UNAUTHORIZED);
      }

      const refreshToken = await this.findToken(token);
      if (!refreshToken) {
        throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
      }

      return refreshToken.expireDate.getTime() > new Date().getTime();
    } catch (error) {
      throw errorHandler(this.logger, error, 'error validating token');
    }
  }

  /**
   * Revoke a token
   * @param token
   */
  async revokeToken(token: string) {
    try {
      await this.prisma.auth_token.delete({ where: { token } });
    } catch (error) {
      throw errorHandler(this.logger, error, 'error on revoke token');
    }
  }

  async revokeTokenFromUser(id: number) {
    try {
      await this.prisma.auth_token.deleteMany({
        where: {
          idUser: id,
          tokenType: { name: { in: [TokenType.ACCESS, TokenType.REFRESH] } },
        },
      });
    } catch (error) {
      throw errorHandler(this.logger, error, 'error on revoke token from user');
    }
  }

  /**
   * Logout a user, delete all tokens
   * @param id
   */
  async logout(id: number): Promise<void> {
    try {
      await this.revokeTokenFromUser(id);
    } catch (error) {
      throw errorHandler(this.logger, error, 'error on logout');
    }
  }

  /**
   * Clear expired tokens
   */
  async clearExpiredTokens(): Promise<void> {
    try {
      await this.prisma.auth_token.deleteMany({
        where: {
          expireDate: {
            lt: new Date(),
          },
        },
      });
    } catch (error) {
      throw errorHandler(this.logger, error, 'Error on clear expired tokens');
    }
  }

  /**
   * Create a token for a user and return a new access token and refresh token
   * @param token
   * @returns token_validation, token_validation
   */
  async createTokens(token: string) {
    try {
      this.logger.log(`refreshToken: ${token}`);

      await this.validateToken(token);

      const refreshToken = await this.findToken(token);

      const user = await this.prisma.user.findUnique({
        where: { idUser: refreshToken.idUser },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      await this.revokeToken(token);
      const createdRefreshToken = await this.createRefreshToken(user, 24); // 24 horas
      const createdAccessToken = await this.createAccessToken(user, 60 * 15); // 15 minutos

      return {
        refresh_token: createdRefreshToken,
        access_token: createdAccessToken,
      };
    } catch (error) {
      throw errorHandler(this.logger, error, 'error creating tokens');
    }
  }

  /**
   * Function to validate user creation token
   * @param token string
   * @returns boolean
   */
  async validateUserCreationToken(token: string): Promise<Response<boolean>> {
    try {
      this.logger.log(`validateUserCreationToken: ${token}`);

      const isValid = await this.isTokenValidationValid(token);

      await this.prisma.auth_token.delete({ where: { token: token } });

      await this.userService.update(isValid.idUser, {
        validated: true,
      });

      return {
        status: Status.SUCCESS,
        message: 'User validated successfully',
        data: true,
      };
    } catch (error) {
      throw errorHandler(
        this.logger,
        error,
        'error validating user creation token',
      );
    }
  }

  /**
   * Function to validate forgot password token
   * @param token string
   * @returns boolean
   */
  async validateForgotPasswordToken(token: string): Promise<auth_token> {
    try {
      this.logger.log(`validateForgotPasswordToken: ${token}`);

      const isValid = await this.isTokenValidationValid(token);

      await this.prisma.auth_token.delete({ where: { token: token } });

      return isValid;
    } catch (error) {
      throw errorHandler(
        this.logger,
        error,
        'error validating forgot password token',
      );
    }
  }

  /**
   * Function to validate if token is valid
   * @param token string
   * @returns boolean
   */
  async isTokenValidationValid(token: string) {
    try {
      this.logger.log(`isTokenValidationValid: ${token}`);

      const isValid = await this.prisma.auth_token.findUnique({
        where: { token: token },
      });

      if (!isValid) {
        throw new HttpException('Token not valid', HttpStatus.UNAUTHORIZED);
      }

      if (isValid.expireDate.getTime() < new Date().getTime()) {
        await this.prisma.auth_token.delete({ where: { token: token } });
        await this.userService.delete(isValid.idUser);
        throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
      }

      return isValid;
    } catch (error) {
      throw errorHandler(
        this.logger,
        error,
        'error validating user creation token',
      );
    }
  }

  /**
   * Create a forgot password token
   * @param user user
   * @returns token_validation
   */
  async createForgotPasswordToken(user: user) {
    try {
      this.logger.log(`createForgotPasswordToken: ${user.email}`);

      const expires = new Date();
      expires.setHours(expires.getHours() + 24); // 24 hours to expire

      const token = await this.createValidationToken(user, 24);

      return token;
    } catch (error) {
      throw errorHandler(
        this.logger,
        error,
        'Error on create forgot password token',
      );
    }
  }

  /**
   * Create a new user token
   * @param user
   * @param expiresHours
   * @returns token_validation
   */
  async createNewUserToken(user: UserWithoutPassword, expiresHours: number) {
    try {
      this.logger.log(`createNewUserToken: ${user.email}`);

      const token = await this.createValidationToken(user, expiresHours);

      return token;
    } catch (error) {
      throw errorHandler(this.logger, error, 'Error on create new user token');
    }
  }

  /**
   * Create a validation token
   * @param user
   * @param expiresHours
   * @returns token_validation
   */
  async createValidationToken(user: UserWithoutPassword, expiresHours: number) {
    try {
      this.logger.log(`createValidationToken: ${user.email}`);

      const expires = new Date();
      expires.setHours(expires.getHours() + expiresHours);

      const token = await this.jwtService.signAsync(
        { sub: user.idUser, email: user.email },
        { expiresIn: 60 * 60 * expiresHours }, // 1 minuto * 60 = 1 hora * 24 = 1 día
      );

      const validationToken = await this.prisma.auth_token.create({
        data: {
          user: {
            connect: {
              idUser: user.idUser,
            },
          },
          expireDate: expires,
          token: token,
          tokenType: {
            connectOrCreate: {
              where: { name: TokenType.VALIDATION },
              create: { name: TokenType.VALIDATION },
            },
          },
        },
      });

      return validationToken;
    } catch (error) {
      throw errorHandler(
        this.logger,
        error,
        'Error on create validation token',
      );
    }
  }
}
