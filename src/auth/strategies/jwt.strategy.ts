import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-key-123',
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);
    console.log('JWT Secret:', process.env.JWT_SECRET || 'dev-secret-key-123');
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
