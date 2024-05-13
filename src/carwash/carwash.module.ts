import { Module } from '@nestjs/common';
import { CarwashController } from './carwash.controller';
import { CarwashService } from './carwash.service';

@Module({
  controllers: [CarwashController],
  providers: [CarwashService]
})
export class CarwashModule {}
