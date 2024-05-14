import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { AccessTokenGuard } from 'src/auth/guards/access-jwt.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({ summary: 'Find all brands' })
  @Get('/')
  @UseGuards(AccessTokenGuard)
  async findAll(@Req() req: Request, @Query() pagination: PaginationDto) {
    const { take, skip } = pagination;
    const { sub } = req.user as any;
    const filter: Prisma.brandFindManyArgs = {
      take,
      skip,
      orderBy: {
        name: 'asc',
      },
    };

    return await this.brandService.findAll(sub, filter);
  }

  @ApiOperation({ summary: 'Find one brand' })
  @Get('/:idBrand')
  @UseGuards(AccessTokenGuard)
  async findOne(@Param('idBrand') idBrand: number) {
    return await this.brandService.findOne(idBrand);
  }

  @ApiOperation({ summary: 'Create a brand' })
  @Post('/')
  @UseGuards(AccessTokenGuard)
  async create(@Req() req: Request, @Body() createBrandDto: CreateBrandDto) {
    const { sub } = req.user as any;
    return await this.brandService.create(sub, createBrandDto);
  }

  @ApiOperation({ summary: 'Update a brand' })
  @Patch('/:idBrand')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('idBrand') idBrand: number,
    @Body() createBrandDto: UpdateBrandDto,
  ) {
    return await this.brandService.update(idBrand, createBrandDto);
  }
}
