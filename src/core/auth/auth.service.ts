import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../users/users.schema';
import { UserRepository } from '../users/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersRepository.findUserByEmail(username);
    if (!user) throw new BadRequestException('Wrong credentials');
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new BadRequestException('Wrong credentials');
    return this.login(user);
  }

  async signUp(dto: RegisterDto) {
    try {
      const user = await this.usersRepository.findUserByEmail(dto.email);
      if (user) throw new BadRequestException('User already exists');
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const newUser = await this.usersRepository.create({
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: dto.firts_name,
        lastName: dto.last_name,
        role: dto.role,
      });

      // send otp
      const token = await this.usersRepository.createToken(newUser.id);

      await this.emailService.sendWelcomeEmail(
        newUser.email,
        newUser.firstName,
      );

      await this.emailService.sendOtpEmail(
        newUser.email,
        newUser.firstName,
        token.token,
        'Please enter the OTP to verify your email address.',
      );
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async resendToken(email: string) {
    try {
      const user = await this.usersRepository.findUserByEmail(email);
      if (!user) throw new BadRequestException('User not found');
      const token = await this.usersRepository.createToken(user.id);
      await this.emailService.sendOtpEmail(
        user.email,
        user.firstName,
        token.token,
        'Please enter the OTP to verify your email address.',
      );
      return;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.usersRepository.findUserByEmail(email);
      if (!user) throw new BadRequestException('User not found');
      const token = await this.usersRepository.createToken(user.id);
      await this.emailService.sendOtpEmail(
        user.email,
        user.firstName,
        token.token,
        'Please enter the OTP to reset your password.',
      );
      return;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const otp = await this.usersRepository.findToken(dto.token);
      if (!otp) throw new BadRequestException('Invalid token');
      if (otp.expiresAt < new Date()) {
        await this.usersRepository.deleteToken(dto.token);
        throw new BadRequestException('Token expired');
      }

      if (!otp.userId) throw new BadRequestException('User not found');
      const user = await this.usersRepository.findUserById(otp.userId);
      if (!user) throw new BadRequestException('User not found');

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const updatedUser = await this.usersRepository.update(otp.userId, {
        passwordHash: hashedPassword,
      });
      await this.usersRepository.deleteToken(dto.token);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async verifyEmail(token: string) {
    try {
      const otp = await this.usersRepository.findToken(token);
      if (!otp) throw new BadRequestException('Invalid token');
      if (otp.expiresAt < new Date()) {
        await this.usersRepository.deleteToken(token);
        throw new BadRequestException('Token expired');
      }

      if (!otp.userId) throw new BadRequestException('User not found');
      const user = await this.usersRepository.findUserById(otp.userId);
      if (!user) throw new BadRequestException('User not found');

      const updatedUser = await this.usersRepository.update(otp.userId, {
        emailVerified: true,
        status: 'ACTIVE',
        lastLogin: new Date(),
      });
      await this.usersRepository.deleteToken(token);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async login(user: User) {
    const tokens = this.generateToken(user);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  private generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: this.configService.get('JWT_SECRET'),
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return { access_token, refresh_token };
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersRepository.findUserById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = this.generateToken(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      refreshToken: null,
      refreshTokenExpiry: null,
    });
  }
}
