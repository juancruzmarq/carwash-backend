import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarwashDto } from './dto/create-carwash.dto';
import { carwash } from '@prisma/client';
import { Response, Status } from 'src/common/types/response.type';

@Injectable()
export class CarwashService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.carwash.findMany();
  }

  async findAllByUser(id: number) {
    return await this.prismaService.carwash.findMany({
      where: {
        user: {
          idUser: id,
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prismaService.carwash.findUnique({
      where: {
        idCarwash: id,
      },
    });
  }

  async create(data: CreateCarwashDto): Promise<Response<carwash>> {
    const carwashExists = await this.prismaService.carwash.findUnique({
      where: {
        name: data.name,
        idUser: data.idUser,
      },
    });

    if (carwashExists) {
      throw new Error('Carwash already exists');
    }

    const carwash = await this.prismaService.carwash.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        user: {
          connect: {
            idUser: data.idUser,
          },
        },
        capacity: data.capacity,
        email: data.email,
        photo: data.photo,
      },
    });

    return {
      status: Status.SUCCESS,
      message: 'Carwash created successfully',
      data: carwash,
    };
  }

  async update(id: number, data: CreateCarwashDto): Promise<Response<carwash>> {
    const carwash = await this.prismaService.carwash.findUnique({
      where: {
        idCarwash: id,
      },
    });

    if (!carwash) {
      throw new Error('Carwash not found');
    }

    if (data.name) {
      const carwashExists = await this.prismaService.carwash.findUnique({
        where: {
          name: data.name,
          idUser: data.idUser,
        },
      });

      if (carwashExists) {
        throw new Error('Carwash already exists');
      }
    }

    const updatedCarwash = await this.prismaService.carwash.update({
      where: {
        idCarwash: id,
      },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        capacity: data.capacity,
        email: data.email,
        photo: data.photo,
      },
    });

    return {
      status: Status.SUCCESS,
      message: 'Carwash updated successfully',
      data: updatedCarwash,
    };
  }
}
