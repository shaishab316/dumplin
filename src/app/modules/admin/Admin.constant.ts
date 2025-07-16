import config from '../../../config';
import { EUserRole } from '../user/User.enum';
import { TUser } from '../user/User.interface';

export const adminData: Omit<TUser, '_id'> = {
  ...config.admin,
  role: EUserRole.ADMIN,
  avatar: config.server.default_avatar,
  phone: '1234567890',
};
