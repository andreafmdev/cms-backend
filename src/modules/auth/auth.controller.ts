import { Body, Controller, Req, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RegisterRequestDto } from './dto/register.request';
import { LocalAuthResponseDto } from './dto/local-auth.response';
import { FastifyRequest } from 'fastify';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
interface RequestWithUser extends FastifyRequest {
  user: LocalAuthResponseDto;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LocalAuthResponseDto,
  })
  login(@Req() req: RequestWithUser) {
    return this.authService.generateTokensForUser(req.user.id);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({
    status: 200,
    description: 'Register successful',
    type: LocalAuthResponseDto,
  })
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    const { username, email, password } = registerRequestDto;
    return this.authService.signUp(username, email, password);
  }
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Refresh token successful',
    type: LocalAuthResponseDto,
  })
  async refreshToken(@Body() refreshTokenDto: { refreshToken: string }) {
    const { refreshToken } = refreshTokenDto;
    return this.authService.refreshToken(refreshToken);
  }
}
