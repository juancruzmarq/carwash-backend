import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Config } from 'src/common/config';
import { JwtPayload } from '../types/jwtPayload.type';
import { JwtPayloadWithAt } from '../types/jwtPayloadWithAt.type';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>(Config.JWT_SECRET),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithAt {
    const accessToken = req?.get('authorization')?.replace('Bearer', '').trim();
    if (!accessToken) throw new ForbiddenException('Refresh token malformed');

    return {
      ...payload,
      accessToken,
    };
  }
}
