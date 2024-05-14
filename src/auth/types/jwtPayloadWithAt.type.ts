import { JwtPayload } from './jwtPayload.type';

export type JwtPayloadWithAt = JwtPayload & { accessToken: string };
