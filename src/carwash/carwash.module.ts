import { Module } from '@nestjs/common';
import { CarwashController } from './carwash.controller';
import { CarwashService } from './carwash.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CarwashController],
  providers: [CarwashService],
})
export class CarwashModule {}
