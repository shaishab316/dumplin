import User from '../user/User.model';
import bcrypt from 'bcryptjs';
import { createToken, verifyToken } from './Auth.utils';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { Document, Types } from 'mongoose';
import config from '../../../config';
import { Response } from 'express';
import { userSelect } from '../user/User.constant';
import { TUser } from '../user/User.interface';
import { ETokenType } from './Auth.enum';

export const AuthServices = {
  async login(user: TUser, password: string) {
    if (!(await bcrypt.compare(password, user.password!)))
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'Your credentials are incorrect.',
      );

    return this.retrieveToken(user._id!);
  },

  setTokens(res: Response, tokens: Record<string, string>) {
    Object.entries(tokens).forEach(([key, value]) =>
      res.cookie(key, value, {
        secure: !config.server.isDevelopment,
        maxAge:
          verifyToken(value, key.replace('_token', '') as ETokenType).exp! *
          1000,
        httpOnly: true,
      }),
    );
  },

  async resetPassword(user: TUser & Document, password: string) {
    if (!user.canResetPassword)
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'Your reset link has expired.',
      );

    user.password = password;
    user.canResetPassword = false;

    return user.save();
  },

  async retrieveToken(userId: Types.ObjectId) {
    const access_token = createToken({ userId }, ETokenType.ACCESS);
    const refresh_token = createToken({ userId }, ETokenType.REFRESH);

    const userData = await User.findById(userId)
      .select(userSelect.join(' '))
      .lean();

    return { access_token, user: userData, refresh_token };
  },
};
