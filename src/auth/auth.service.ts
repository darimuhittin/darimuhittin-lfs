import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { FirestoreService } from '../firestore/firestore.service';

type FirestoreUser = Omit<User, 'id'> & {
  refreshToken?: string;
};

@Injectable()
export class AuthService {
  private readonly USERS_COLLECTION = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly firestoreService: FirestoreService,
  ) {}

  private generateTokens(payload: {
    email: string;
    sub: string;
    role: string;
  }) {
    // Access token - short lived (15 minutes)
    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' },
      { expiresIn: '15m' },
    );

    // Refresh token - long lived (7 days) with different type
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ) {
    await this.firestoreService.update(this.USERS_COLLECTION, userId, {
      refreshToken: refreshToken ? await bcrypt.hash(refreshToken, 10) : null,
    });
  }

  private async verifyRefreshToken(storedHash: string, refreshToken: string) {
    try {
      // Verify the token is a refresh token
      const decoded = this.jwtService.verify(refreshToken);
      if (decoded.type !== 'refresh') {
        return false;
      }
      // Compare the hashed token
      return bcrypt.compare(refreshToken, storedHash);
    } catch {
      return false;
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const users = await this.firestoreService.findBy<FirestoreUser>(
      this.USERS_COLLECTION,
      'email',
      email,
    );

    if (users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, refreshToken: __, ...result } = user;
    return result as User;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id, role: user.role };
    const tokens = this.generateTokens(payload);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUsers = await this.firestoreService.findBy<FirestoreUser>(
      this.USERS_COLLECTION,
      'email',
      registerDto.email,
    );

    if (existingUsers.length > 0) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser: FirestoreUser = {
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      role: UserRole.STAFF,
    };

    const user = await this.firestoreService.create(
      this.USERS_COLLECTION,
      newUser,
    );
    const { password: _, refreshToken: __, ...result } = user;
    const payload = { email: result.email, sub: result.id, role: result.role };
    const tokens = this.generateTokens(payload);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: result,
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.firestoreService.findOne<FirestoreUser>(
        this.USERS_COLLECTION,
        decoded.sub,
      );

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValid = await this.verifyRefreshToken(
        user.refreshToken,
        refreshToken,
      );
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = { email: user.email, sub: user.id, role: user.role };
      const tokens = this.generateTokens(payload);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      const { password: _, refreshToken: __, ...result } = user;
      return {
        user: result,
        ...tokens,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.updateRefreshToken(userId, null);
    return { success: true };
  }

  async getCurrentUser(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    const user = await this.firestoreService.findOne<FirestoreUser>(
      this.USERS_COLLECTION,
      userId,
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _, refreshToken: __, ...result } = user;
    return result;
  }
}
