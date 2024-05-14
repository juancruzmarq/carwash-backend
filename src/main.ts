import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Config } from './common/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  // Check all env variables are set
  const configService = app.get(ConfigService);
  const requiredEnvVariables = Object.values(Config);

  for (const envVariable of requiredEnvVariables) {
    if (!configService.get(envVariable)) {
      logger.error(`ENV variable ${envVariable} is missing`);
      process.exit(1);
    }
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Carwash')
    .setDescription('The carwash API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>(Config.PORT) || 3000);
  logger.log(`Application is running on: ${configService.get(Config.PORT)}`);
}
bootstrap();
