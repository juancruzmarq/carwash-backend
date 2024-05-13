import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(idUser?: number) {
    const globalBrands = await this.prismaService.globalBrand.findMany();
    if (idUser) {
      const userBrands = await this.prismaService.userBrand.findMany({
        where: {
          idUser,
        },
      });
      return [...globalBrands, ...userBrands];
    }
    return globalBrands;
  }
}
