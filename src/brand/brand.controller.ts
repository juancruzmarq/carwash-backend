import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { AccessTokenGuard } from 'src/auth/guards/access-jwt.guard';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({ summary: 'Find all brands' })
  @Get('/:idUser')
  @UseGuards(AccessTokenGuard)
  async findAll() {
    // const { user } = req;
    // console.log(user);
    // return await this.brandService.findAll(idUser);
  }
}
