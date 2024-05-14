import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/common/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { TokenService } from './token.service';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>(Config.JWT_SECRET),
          signOptions: {
            expiresIn: configService.get<string>(Config.ACCESS_TOKEN_TTL),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AtStrategy, RtStrategy],
})
export class AuthModule {}
