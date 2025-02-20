import jwt from 'jsonwebtoken';
import { IUser } from '@/app/models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
