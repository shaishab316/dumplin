import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { AuthServices } from '../auth/Auth.service';
import { OtpServices } from './Otp.service';

export const OtpControllers = {
  send: catchAsync(async ({ body }, res) => {
    const otp = await OtpServices.send(body.email);

    serveResponse(res, {
      message: 'OTP sent successfully!',
      data: {
        expiredAt: otp?.exp?.toLocaleTimeString(),
      },
    });
  }),

  verify: catchAsync(async (req, res) => {
    const reset_token = await OtpServices.verify(req.user!._id!, req.body.otp);

    AuthServices.setTokens(res, { reset_token });

    serveResponse(res, {
      message: 'OTP verified successfully!',
      data: { reset_token },
    });
  }),

  list: catchAsync(async ({ query }, res) => {
    const { meta, otps } = await OtpServices.list(query);

    serveResponse(res, {
      message: 'OTPs retrieved successfully!',
      meta,
      data: otps,
    });
  }),
};
