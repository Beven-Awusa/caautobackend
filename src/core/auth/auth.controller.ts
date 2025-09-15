import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResendOtpDto } from './dto/resend-token.dto';
import { TokenDto } from './dto/verify-email.dto';
import { JWTGuard, JWTRefreshGuard } from 'src/common/guards';
import { UserId, Users } from 'src/common/decorator';
import { LoginDto } from './dto/login.dto';
import { LocalStrategy } from './strategy/local.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - User already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalStrategy)
  async login(@Body() dto: LoginDto) {
    return this.authService.validateUser(dto.email, dto.password);
  }

  @ApiOperation({ summary: 'Resend verification token' })
  @ApiResponse({ status: 200, description: 'Token resent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  @Post('resend-token')
  async resendToken(@Body() dto: ResendOtpDto) {
    return this.authService.resendToken(dto.email);
  }

  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ResendOtpDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async verifyEmail(@Body() dto: TokenDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('logout')
  @UseGuards(JWTGuard)
  @HttpCode(HttpStatus.OK)
  logout(@UserId() userId: string) {
    return this.authService.logout(userId);
  }

  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'New tokens generated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Access Denied - Invalid refresh token',
  })
  @Get('refresh')
  @UseGuards(JWTRefreshGuard)
  @HttpCode(HttpStatus.OK)
  refresh(@Users() user) {
    return this.authService.refreshTokens(user.id, user.refreshToken);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('me')
  @UseGuards(JWTGuard)
  @HttpCode(HttpStatus.OK)
  me(@Users() user) {
    return user;
  }
}
