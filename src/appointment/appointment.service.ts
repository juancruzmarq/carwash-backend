import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, appointment } from '@prisma/client';
import { Response, Status } from 'src/common/types/response.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    filters?: Prisma.appointmentFindManyArgs,
  ): Promise<Response<appointment[]>> {
    const appointments = await this.prismaService.appointment.findMany({
      ...filters,
    });

    if (appointments.length === 0) {
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: Status.SUCCESS,
      data: appointments,
      message: 'Appointment found',
    };
  }

  async findByCarwash(
    idCarwash: number,
    filters?: Prisma.appointmentFindManyArgs,
  ): Promise<Response<appointment[]>> {
    const appointments = await this.prismaService.appointment.findMany({
      where: {
        carwash: {
          idCarwash,
        },
      },
      ...filters,
    });

    if (appointments.length === 0) {
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: Status.SUCCESS,
      data: appointments,
      message: 'Appointments found',
    };
  }

  async create(data: CreateAppointmentDto): Promise<Response<appointment>> {
    const { idCarwash, services, idVehicle, note, idClient } = data;

    const appointment = await this.prismaService.appointment.create({
      data: {
        note,
        services: {
          connect: services.map((idService) => ({ idService })),
        },
        vehicle: {
          connect: {
            idVehicle,
          },
        },
        carwash: {
          connect: {
            idCarwash,
          },
        },
        client: {
          connect: {
            idClient,
          },
        },
      },
    });

    return {
      status: Status.SUCCESS,
      data: appointment,
      message: 'Appointment created',
    };
  }
}
