import { Logger, Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { user } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { Response, Status } from '../common/types/response.type';

import { exclude } from '../common/utils/exclude';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorHandler } from 'src/common/utils/errorHandler';
import { UserWithoutPassword } from './types/userWithoutPassword.type';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserCreateDto } from './dto/user-create.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw errorHandler(this.logger, error, 'error finding user by email');
    }
  }

  async findByEmailAndDeleteIfNot(email: string): Promise<boolean | user> {
    try {
      const user = await this.findByEmail(email);

      if (user && !user.validated) {
        await this.prisma.auth_token.deleteMany({
          where: {
            idUser: user.idUser,
          },
        });
        await this.prisma.user.delete({
          where: {
            email: email,
          },
        });
        return false;
      }

      return user;
    } catch (error) {
      throw errorHandler(
        this.logger,
        error,
        'error on findyByEmailAndDeleteIfNot',
      );
    }
  }

  async findById(id: number): Promise<UserWithoutPassword> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          idUser: id,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const userWithoutPassword = exclude(user, ['password']);

      return userWithoutPassword;
    } catch (error) {
      throw errorHandler(this.logger, error, 'error finding user by id');
    }
  }

  async findAll(): Promise<Response<UserWithoutPassword[]>> {
    try {
      const users = await this.prisma.user.findMany();

      const usersWithoutPassword = users.map((user) =>
        exclude(user, ['password']),
      );

      return {
        status: Status.SUCCESS,
        message: 'Users found successfully',
        data: usersWithoutPassword,
      };
    } catch (error) {
      throw errorHandler(this.logger, error, 'error finding all users');
    }
  }

  async create(data: UserCreateDto): Promise<Response<UserWithoutPassword>> {
    try {
      const { email, password } = data;

      const alreadyExists = await this.findByEmail(email);

      if (alreadyExists) {
        throw new HttpException(
          'There is already a user with that email',
          HttpStatus.BAD_REQUEST,
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const userCreated = await this.prisma.user.create({
        data: {
          email,
          password: hash,
        },
      });

      const userWithoutPassword = exclude(userCreated, ['password']);

      return {
        status: Status.SUCCESS,
        message: 'User created successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      throw errorHandler(this.logger, error, 'error creating user');
    }
  }

  async update(id: number, data: UserUpdateDto): Promise<Response<user>> {
    try {
      const { password, validated } = data;

      const exists = await this.findById(id);

      if (!exists) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      let salt: string;
      let hash: string;

      if (password) {
        salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(password, salt);
      }

      const userUpdated = await this.prisma.user.update({
        where: {
          idUser: id,
        },
        data: {
          password: hash,
          validated: validated,
        },
      });

      delete userUpdated.password;
      return {
        status: Status.SUCCESS,
        message: 'User updated successfully',
        data: userUpdated,
      };
    } catch (error) {
      throw errorHandler(this.logger, error, 'error updating user');
    }
  }

  async comparePassword(password: string, hash: string) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw errorHandler(this.logger, error, 'error comparing password');
    }
  }

  async delete(id: number): Promise<Response<null>> {
    try {
      await this.prisma.user.delete({
        where: {
          idUser: id,
        },
      });

      return {
        status: Status.SUCCESS,
        message: 'User deleted successfully',
        data: null,
      };
    } catch (error) {
      throw errorHandler(this.logger, error, 'error deleting user');
    }
  }
}
