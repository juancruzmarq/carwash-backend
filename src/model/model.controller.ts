import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ModelService } from './model.service';
import { ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-jwt.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelto } from './dto/update-model.dto';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @ApiOperation({ summary: 'Get all models' })
  @UseGuards(AccessTokenGuard)
  @Get('/')
  async findAll(@Req() req: Request, @Query() pagination: PaginationDto) {
    const { sub } = req.user as any;
    const { take, skip } = pagination;
    const filters: Prisma.modelFindManyArgs = {
      take,
      skip,
      orderBy: {
        name: 'asc',
      },
    };
    return await this.modelService.findAll(sub, filters);
  }

  @ApiOperation({ summary: 'Get one model' })
  @UseGuards(AccessTokenGuard)
  @Get('/:idModel')
  async findOne(@Param('idModel') idModel: number) {
    return await this.modelService.findAll(idModel);
  }

  @ApiOperation({ summary: 'Create a model' })
  @UseGuards(AccessTokenGuard)
  @Post('/')
  async create(@Req() req: Request, @Body() createModelDto: CreateModelDto) {
    const { sub } = req.user as any;
    return await this.modelService.create(sub, createModelDto);
  }

  @ApiOperation({ summary: 'Update a model' })
  @UseGuards(AccessTokenGuard)
  @Patch('/:idModel')
  async update(
    @Param('idModel') idModel: number,
    @Body() updateModelDto: UpdateModelto,
  ) {
    return await this.modelService.update(idModel, updateModelDto);
  }

  @ApiOperation({ summary: 'Delete a model' })
  @UseGuards(AccessTokenGuard)
  @Delete('/:idModel')
  async remove(@Param('idModel') idModel: number) {
    return await this.modelService.delete(idModel);
  }
}
