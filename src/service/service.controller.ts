import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-jwt.guard';
import { Request } from 'express';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @ApiOperation({ summary: 'Find all services' })
  @UseGuards(AccessTokenGuard)
  @Get('/')
  async findAll(
    @Req() req: Request,
    @Query() pagination: PaginationDto,
    @Query('deleted') deleted: boolean,
  ) {
    const { sub } = req.user as any;
    const { skip, take } = pagination;
    const filters: Prisma.serviceFindManyArgs = {
      where: {
        carwash: {
          user: {
            idUser: sub,
          },
        },
        state: deleted ? undefined : true,
      },
      include: {
        priceHistories: true,
      },
      skip,
      take,
    };
    return await this.serviceService.findAll(filters);
  }

  @ApiOperation({ summary: 'Find service by carwash' })
  @UseGuards(AccessTokenGuard)
  @Get('/carwash/:idCarwash')
  async findAllByCarwash(
    @Param('idCarwash') idCarwash: number,
    @Query() pagination: PaginationDto,
  ) {
    const { skip, take } = pagination;
    const filters: Prisma.serviceFindManyArgs = {
      skip,
      take,
    };
    return await this.serviceService.findAllByCarwash(idCarwash, filters);
  }

  @ApiOperation({ summary: 'Find one service' })
  @UseGuards(AccessTokenGuard)
  @Get('/:idService')
  async findOne(@Param() idService: number) {
    return await this.serviceService.findOne(idService);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a service' })
  @UseGuards(AccessTokenGuard)
  @Post('/')
  async create(@Body() data: CreateServiceDto) {
    return await this.serviceService.create(data);
  }

  @ApiOperation({ summary: 'Update a service' })
  @UseGuards(AccessTokenGuard)
  @Post('/:idService')
  async update(
    @Param('idService') idService: number,
    @Body() data: UpdateServiceDto,
  ) {
    return await this.serviceService.update(idService, data);
  }

  @ApiOperation({ summary: 'Delete a service' })
  @UseGuards(AccessTokenGuard)
  @Delete('/:idService')
  async delete(@Param('idService') idService: number) {
    return await this.serviceService.delete(idService);
  }
}
