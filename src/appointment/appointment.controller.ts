import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @ApiOperation({ summary: 'Find all appointments' })
  @Get('/')
  async findAll() {
    return await this.appointmentService.findAll();
  }

  @ApiOperation({ summary: 'Find all appointments by carwash' })
  @Get('/carwash/:idCarwash')
  async findAllByCarwash(idCarwash: number) {
    return await this.appointmentService.findByCarwash(idCarwash);
  }

  @ApiOperation({ summary: 'Create a new appointment' })
  @Post('/')
  async create(@Body() data: CreateAppointmentDto) {
    return await this.appointmentService.create(data);
  }
}
