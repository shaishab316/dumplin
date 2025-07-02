import { AuthServices } from './Auth.service';
import catchAsync from '../../../util/server/catchAsync';
import config from '../../../config';
import serveResponse from '../../../util/server/serveResponse';

export const AuthControllers = {
  login: catchAsync(async (req, res) => {
    const { access_token, refresh_token, user } = await AuthServices.login(
      req.user!,
      req.body.password,
    );

    AuthServices.setTokens(res, { access_token, refresh_token });

    serveResponse(res, {
      message: 'Login successfully!',
      data: { token: access_token, user },
    });
  }),

  logout: catchAsync(async (req, res) => {
    Object.keys(req.cookies).forEach(cookie =>
      res.clearCookie(cookie, {
        httpOnly: true,
        secure: !config.server.isDevelopment,
        maxAge: 0, // expires immediately
      }),
    );

    serveResponse(res, {
      message: 'Logged out successfully',
    });
  }),

  resetPassword: catchAsync(async ({ body, user }, res) => {
    await AuthServices.resetPassword(user as any, body.password);

    res.clearCookie('reset_token', {
      httpOnly: true,
      secure: !config.server.isDevelopment,
      maxAge: 0, // expires immediately
    });

    serveResponse(res, {
      message: 'Password reset successfully!',
    });
  }),

  refreshToken: catchAsync(async ({ user }, res) => {
    const { access_token } = await AuthServices.retrieveToken(user!._id!);

    AuthServices.setTokens(res, { access_token });

    serveResponse(res, {
      message: 'Token refreshed successfully!',
      data: { token: access_token },
    });
  }),

  loginWith: catchAsync(async (req, res) => {
    const { access_token, refresh_token, user } =
      await AuthServices.loginWith(req);

    AuthServices.setTokens(res, { access_token, refresh_token });

    serveResponse(res, {
      message: 'Login successfully!',
      data: { token: access_token, user },
    });
  }),
};
