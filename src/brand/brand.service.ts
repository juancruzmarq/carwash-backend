import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(idUser?: number, filters?: Prisma.brandFindManyArgs) {
    const brands = await this.prismaService.brand.findMany({
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
      ...filters,
    });

    return brands;
  }

  async findOne(idBrand: number) {
    const globalBrand = await this.prismaService.brand.findUnique({
      where: {
        idBrand,
      },
    });

    return globalBrand;
  }

  async findModels(idBrand: number) {
    const brandWithModels = await this.prismaService.brand.findUnique({
      where: {
        idBrand,
      },
      include: {
        model: true,
      },
    });

    return brandWithModels;
  }

  async create(idUser: number, data: CreateBrandDto) {
    const brand = await this.prismaService.brand.findFirst({
      where: {
        name: data.name,
        idUser,
      },
    });

    if (brand) {
      throw new HttpException('Brand already exists', HttpStatus.CONFLICT);
    }

    const createdBrand = await this.prismaService.brand.create({
      data: {
        ...data,
        idUser,
      },
    });

    return createdBrand;
  }

  async update(idBrand: number, data: UpdateBrandDto) {
    const brand = await this.prismaService.brand.findUnique({
      where: {
        idBrand,
      },
    });

    if (!brand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    const updatedBrand = await this.prismaService.brand.update({
      where: {
        idBrand,
      },
      data,
    });

    return updatedBrand;
  }

  async delete(idBrand: number) {
    const brand = await this.prismaService.brand.findUnique({
      where: {
        idBrand,
      },
    });

    if (!brand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.brand.delete({
      where: {
        idBrand,
      },
    });

    return brand;
  }
}
