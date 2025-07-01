import { Router } from 'express';
import { UserControllers } from './User.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { UserValidations } from './User.validation';
import User from './User.model';

/** Admin Routes */
const admin = Router();

admin.get(
  '/',
  purifyRequest(QueryValidations.list, UserValidations.list),
  UserControllers.list,
);

admin.delete(
  '/:userId/delete',
  purifyRequest(QueryValidations.exists('userId', User)),
  UserControllers.delete,
);

export const UserRoutes = {
  admin,
};
