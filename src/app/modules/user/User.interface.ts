import { Types } from 'mongoose';
import { EUserRole } from './User.enum';

export type TUser = {
  _id: Types.ObjectId;

  name?: string;
  email: string;
  password: string;
  avatar?: string;
  role: EUserRole;
  phone?: string;
  canResetPassword?: boolean;

  googleId?: string;
  facebookId?: string;
  appleId?: string;

  createdAt?: Date;
  updatedAt?: Date;
};
