import { Body, Controller, Req, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RegisterRequestDto } from './dto/register.request';
import { LocalAuthResponseDto } from './dto/local-auth.response';
import { FastifyRequest } from 'fastify';
interface RequestWithUser extends FastifyRequest {
  user: LocalAuthResponseDto;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: RequestWithUser) {
    return this.authService.signIn(req.user.email);
  }
  @Post('register')
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    const { username, email, password } = registerRequestDto;
    return this.authService.signUp(username, email, password);
  }
}
