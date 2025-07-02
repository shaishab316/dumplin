import { UserServices } from './User.service';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { StatusCodes } from 'http-status-codes';
import { userSelect } from './User.constant';
import { AuthServices } from '../auth/Auth.service';
import { TUser } from './User.interface';

export const UserControllers = {
  create: catchAsync(async ({ body }, res) => {
    const user: any = await UserServices.create(body);

    const { access_token, refresh_token } = await AuthServices.retrieveToken(
      user._id!,
    );

    AuthServices.setTokens(res, { access_token, refresh_token });

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: `User registered successfully!`,
      data: {
        token: access_token,
        user: userSelect.reduce((obj, field) => {
          obj[field] = user[field];
          return obj;
        }, {} as any),
      },
    });
  }),

  edit: catchAsync(async ({ body, user }, res) => {
    const data = await UserServices.edit({
      ...body,
      oldAvatar: user?.avatar,
      _id: user?._id,
    });

    serveResponse(res, {
      message: 'Profile updated successfully!',
      data,
    });
  }),

  changePassword: catchAsync(async ({ user, body }, res) => {
    await UserServices.changePassword(user as any, body);

    serveResponse(res, {
      message: 'Password changed successfully!',
    });
  }),

  list: catchAsync(async (req, res) => {
    const { meta, users } = await UserServices.list(req.query);

    serveResponse(res, {
      message: 'Users retrieved successfully!',
      meta,
      data: users,
    });
  }),

  me: catchAsync(({ user }: any, res) => {
    serveResponse(res, {
      message: 'Profile fetched successfully!',
      data: userSelect.reduce((obj, field) => {
        obj[field] = user[field];
        return obj;
      }, {} as any),
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    const user = await UserServices.delete(params.userId);

    serveResponse(res, {
      message: `${user?.name ?? user?.role?.toCapitalize()} deleted successfully!`,
    });
  }),
};
