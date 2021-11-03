import jwt from 'jsonwebtoken';
import { UserDocument } from '../../models/user';

const JWT_ALGORITHM = 'HS256';
const AUTHENTICATION_TOKEN_EXPIRATION_HOURS = '1d';

export function generateAuthToken(user: UserDocument): string {
  const { id } = user;
  const jwtPayload = { id };

  return jwt.sign(jwtPayload, process.env.JWT_KEY!, {
    algorithm: JWT_ALGORITHM,
    expiresIn: AUTHENTICATION_TOKEN_EXPIRATION_HOURS,
  });
}
