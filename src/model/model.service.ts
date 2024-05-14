import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelto } from './dto/update-model.dto';

@Injectable()
export class ModelService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(idUser?: number, filters?: Prisma.modelFindManyArgs) {
    const models = await this.prismaService.model.findMany({
      where: {
        OR: [
          {
            idUser,
          },
          {
            idUser: null,
          },
        ],
      },
      include: {
        brand: true,
      },
      ...filters,
    });

    return models;
  }

  async findOne(idModel: number) {
    const globalModel = await this.prismaService.model.findUnique({
      where: {
        idModel,
      },
    });

    return globalModel;
  }

  async create(idUser: number, data: CreateModelDto) {
    const model = await this.prismaService.model.findFirst({
      where: {
        name: data.name,
        idUser,
      },
    });

    if (model) {
      throw new HttpException('Model already exists', HttpStatus.CONFLICT);
    }

    return await this.prismaService.model.create({
      data: {
        ...data,
        idUser,
      },
    });
  }

  async update(idModel: number, data: UpdateModelto) {
    return await this.prismaService.model.update({
      where: {
        idModel,
      },
      data,
    });
  }

  async delete(idModel: number) {
    return await this.prismaService.model.delete({
      where: {
        idModel,
      },
    });
  }
}
