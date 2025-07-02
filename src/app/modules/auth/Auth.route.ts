import express from 'express';
import { AuthControllers } from './Auth.controller';
import { AuthValidations } from './Auth.validation';
import auth from '../../middlewares/auth';
import { UserControllers } from '../user/User.controller';
import { UserValidations } from '../user/User.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import { temUser } from '../../middlewares/temUser';
import { OtpRoutes } from '../otp/Otp.route';

const router = express.Router();

router.post(
  '/register',
  purifyRequest(UserValidations.createUser),
  UserControllers.create,
);

router.post(
  '/login',
  purifyRequest(AuthValidations.login),
  temUser('+password'),
  AuthControllers.login,
);

router.post(
  '/login/:provider',
  purifyRequest(AuthValidations.loginWith),
  AuthControllers.loginWith,
);

router.post('/logout', AuthControllers.logout);

router.use('/otp', OtpRoutes.user);

router.post(
  '/reset-password',
  auth.reset(),
  purifyRequest(AuthValidations.resetPassword),
  AuthControllers.resetPassword,
);

/**
 * generate new access token
 */
router.get(
  '/refresh-token',
  purifyRequest(AuthValidations.refreshToken),
  auth.refresh(),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;
