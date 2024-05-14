import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CarwashService } from './carwash.service';
import { ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-jwt.guard';
import { CreateCarwashDto } from './dto/create-carwash.dto';
import { UpdateCarwashDto } from './dto/update-carwash.dto';

@Controller('carwash')
export class CarwashController {
  constructor(private readonly carwashService: CarwashService) {}

  @ApiOperation({ summary: 'Find all carwashes' })
  @Get('/')
  async findAll() {
    return await this.carwashService.findAll();
  }

  @ApiOperation({ summary: 'Find all carwashes by user' })
  @UseGuards(AccessTokenGuard)
  @Get('/user/:idUser')
  async findAllByUser(@Param('idUser') idUser: number) {
    return await this.carwashService.findAllByUser(idUser);
  }

  @ApiOperation({ summary: 'Find one carwash' })
  @UseGuards(AccessTokenGuard)
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.carwashService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a carwash' })
  @UseGuards(AccessTokenGuard)
  @Post('/create')
  async create(@Body() data: CreateCarwashDto) {
    return await this.carwashService.create(data);
  }

  @ApiOperation({ summary: 'Update a carwash' })
  @UseGuards(AccessTokenGuard)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() data: UpdateCarwashDto) {
    return await this.carwashService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete a carwash' })
  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.carwashService.delete(id);
  }
}
