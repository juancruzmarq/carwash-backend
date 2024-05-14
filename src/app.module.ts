import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand/brand.module';
import { ServiceModule } from './service/service.module';
import { ModelModule } from './model/model.module';
import { CarwashModule } from './carwash/carwash.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // lifetime of a record in milliseconds
        limit: 10, // number of allowed attempts per ttl period
      },
    ]),
    UserModule,
    PrismaModule,
    AppointmentModule,
    AuthModule,
    BrandModule,
    ServiceModule,
    ModelModule,
    CarwashModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
