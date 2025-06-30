import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { UserRoutes } from '../user/User.route';
import { OtpRoutes } from '../otp/Otp.route';
import { NotificationRoutes } from '../notification/Notification.route';

const routes: TRoute[] = [
  {
    path: '/users',
    route: UserRoutes.admin,
  },
  {
    path: '/otps',
    route: OtpRoutes.admin,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
];

export default Router().inject(routes);
