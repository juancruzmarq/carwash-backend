import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Find all users' })
  @Get('/')
  async findAll() {
    return await this.userService.findAll();
  }

  @ApiOperation({ summary: 'Find one user' })
  @ApiParam({ name: 'id', type: String })
  @Get('/:id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return await this.userService.findById(id);
  }
}
