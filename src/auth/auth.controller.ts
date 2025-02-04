// nestjs imports
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

// Local imports
import { AuthService } from './auth.service';
import { RestoreDto } from './dto/restore-password.dto';
import { SignupDto } from './dto/signup.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TokenService } from 'src/token/token.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotDto } from './dto/forgot-password.dto';
import { AccessTokenGuard } from './guards/access-jwt.guard';
import { RefreshTokenGuard } from './guards/refresh-jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @ApiOperation({ summary: 'Validate user creation token' })
  @ApiParam({ name: 'token', type: String })
  @Post('/validate/:token')
  async validate(@Param('token') token: string) {
    return await this.tokenService.validateUserCreationToken(token);
  }

  @ApiOperation({ summary: 'User signup' })
  @ApiBody({ type: SignupDto })
  @Post('/signup')
  async signup(@Body() data: SignupDto) {
    return await this.authService.signUp(data);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @Post('/login')
  async login(@Body() data: LoginDto) {
    return await this.authService.signIn(data);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiParam({ name: 'id', type: Number })
  @Post('/logout/:id')
  @UseGuards(AccessTokenGuard)
  async logout(@Param('id', new ParseIntPipe()) id: number) {
    return this.authService.logout(id);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiBody({ type: RefreshDto })
  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Body() token: RefreshDto) {
    return this.authService.refresh(token);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @ApiBody({ type: ForgotDto })
  @Post('/forgot-password')
  @UseGuards(AccessTokenGuard)
  async forgotPassword(@Body() data: ForgotDto) {
    return this.authService.forgotPassword(data);
  }

  @ApiOperation({ summary: 'Restore password' })
  @ApiParam({ name: 'token', type: String })
  @ApiBody({ type: RestoreDto })
  @Post('/restore-password/:token')
  async resetPassword(@Param('token') token: string, @Body() data: RestoreDto) {
    return this.authService.restorePassword(token, data);
  }
}
