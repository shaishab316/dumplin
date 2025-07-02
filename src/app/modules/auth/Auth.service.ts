import User from '../user/User.model';
import bcrypt from 'bcryptjs';
import { createToken, verifyToken } from './Auth.utils';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { Document, Types } from 'mongoose';
import config from '../../../config';
import { Request, Response } from 'express';
import { userSelect } from '../user/User.constant';
import { TUser } from '../user/User.interface';
import { ETokenType } from './Auth.enum';
import deleteFile from '../../../util/file/deleteFile';
import downloadImage from '../../../util/file/downloadImage';
import { facebookUser } from './Auth.lib';

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

  async loginWith({ params: { provider }, body, headers }: Request) {
    const token = headers.authorization?.split(/Bearer /i)?.[1];

    switch (provider) {
      case 'facebook':
        if (!token)
          throw new ServerError(
            StatusCodes.UNAUTHORIZED,
            'Failed to login with facebook',
          );

        return await this.facebookLogin(token);
      case 'google':
        return await this.googleLogin(body);
      case 'apple':
      //* TODO: implement apple login
    }
  },

  async facebookLogin(token: string) {
    const userData = await facebookUser(token);
    const avatar = userData?.picture?.data?.url;

    let user = await User.findOne({ facebookId: userData.id }).select(
      '+facebookId',
    );

    const newAvatar = avatar
      ? await downloadImage(avatar)
      : config.server.default_avatar;

    if (!user)
      user = await User.create({
        name: userData.name,
        email: userData.email,
        avatar: newAvatar,
        facebookId: userData.id,
      });
    else {
      if (newAvatar && user.avatar !== newAvatar) {
        const oldAvatar = user.avatar;
        user.avatar = newAvatar;
        if (oldAvatar) await deleteFile(oldAvatar);
      }

      Object.assign(user, { name: userData.name, facebookId: userData.id });
      await user.save();
    }

    return this.retrieveToken(user._id);
  },

  async googleLogin({ email, name, uid, avatar }: any) {
    let user = await User.findOne({ email }).select('+googleId');
    const newAvatar = avatar
      ? await downloadImage(avatar)
      : config.server.default_avatar;

    if (!user)
      user = await User.create({
        email,
        name,
        avatar: newAvatar,
        googleId: uid,
      });
    else {
      if (user.googleId && user.googleId !== uid)
        throw new ServerError(
          StatusCodes.UNAUTHORIZED,
          'Failed to login with google',
        );

      if (newAvatar && user.avatar !== newAvatar) {
        const oldAvatar = user.avatar;
        user.avatar = newAvatar;
        if (oldAvatar) await deleteFile(oldAvatar);
      }

      Object.assign(user, { name, googleId: uid });
      await user.save();
    }

    return this.retrieveToken(user._id);
  },
};
