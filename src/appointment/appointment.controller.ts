import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor() {}

  @Get('/')
  async getAppointments() {
    return [];
  }

  @Get('/:id')
  async getAppointmentById() {
    return {};
  }

  @Get('/carwash/:id')
  async getAppointmentsByCarwash() {
    return [];
  }
}
