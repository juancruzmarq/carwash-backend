import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TokenService],
})
export class TokenModule {}
