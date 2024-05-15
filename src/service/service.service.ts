import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, service } from '@prisma/client';
import { Response, Status } from 'src/common/types/response.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    filters?: Prisma.serviceFindManyArgs,
  ): Promise<Response<service[]>> {
    const services = await this.prismaService.service.findMany({
      ...filters,
    });

    if (services.length === 0) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: Status.SUCCESS,
      data: services,
      message: 'Service found',
    };
  }

  async findAllByCarwash(
    idCarwash: number,
    filters?: Prisma.serviceFindManyArgs,
  ): Promise<Response<service[]>> {
    const services = await this.prismaService.service.findMany({
      where: {
        carwash: {
          idCarwash,
        },
      },
      include: {
        priceHistories: true,
      },
      ...filters,
    });

    if (services.length === 0) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: Status.SUCCESS,
      data: services,
      message: 'Service found',
    };
  }

  async findOne(idService: number): Promise<Response<service>> {
    const service = await this.prismaService.service.findFirst({
      where: {
        idService: idService,
      },
      include: {
        priceHistories: true,
      },
    });

    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: Status.SUCCESS,
      data: service,
      message: 'Service found',
    };
  }

  async create(data: any): Promise<Response<service>> {
    const exists = await this.prismaService.carwash.findFirst({
      where: {
        name: data.name,
        idCarwash: data.carwash,
      },
    });

    if (exists) {
      throw new HttpException('Service already exists', HttpStatus.CONFLICT);
    }

    const service = await this.prismaService.service.create({
      data: {
        name: data.name,
        description: data.description,
        priceHistories: {
          create: {
            price: data.price,
          },
        },
        carwash: {
          connect: {
            idCarwash: data.carwash,
          },
        },
      },
    });

    return {
      status: Status.SUCCESS,
      data: service,
      message: 'Service created',
    };
  }

  async update(
    idService: number,
    data: UpdateServiceDto,
  ): Promise<Response<service>> {
    const service = await this.prismaService.service.findFirst({
      where: {
        idService,
        state: true,
      },
      include: {
        priceHistories: {
          where: {
            endedAt: null,
          },
        },
      },
    });

    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    // If the price is different from the current price, end the current price history and create a new one
    if (data.price !== service.priceHistories[0]?.price) {
      await this.prismaService.priceHistory.update({
        where: {
          idPriceHistory: service.priceHistories[0].idPriceHistory,
        },
        data: {
          endedAt: new Date(),
        },
      });

      await this.prismaService.priceHistory.create({
        data: {
          price: data.price,
          service: {
            connect: {
              idService,
            },
          },
        },
      });
    }

    const updatedService = await this.prismaService.service.update({
      where: {
        idService,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return {
      status: Status.SUCCESS,
      data: updatedService,
      message: 'Service updated',
    };
  }

  async delete(idService: number): Promise<Response<service>> {
    const service = await this.prismaService.service.findFirst({
      where: {
        idService,
        state: true,
      },
    });

    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.service.update({
      where: {
        idService,
      },
      data: {
        state: false,
      },
    });

    return {
      status: Status.SUCCESS,
      data: service,
      message: 'Service deleted',
    };
  }
}
