import { Router } from 'express';
import { FavoriteRestaurantControllers } from './FavoriteRestaurant.controller';
import { FavoriteRestaurantValidations } from './FavoriteRestaurant.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import FavoriteRestaurant from './FavoriteRestaurant.model';

const router = Router();

router.get(
  '/',
  purifyRequest(QueryValidations.list),
  FavoriteRestaurantControllers.list,
);

router.get(
  '/is-favorite',
  purifyRequest(FavoriteRestaurantValidations.isFavorite),
  FavoriteRestaurantControllers.isFavorite,
);

router.get(
  '/:favRestaurantId',
  purifyRequest(QueryValidations.exists('favRestaurantId', FavoriteRestaurant)),
  FavoriteRestaurantControllers.retrieve,
);

router.post(
  '/add',
  purifyRequest(FavoriteRestaurantValidations.add),
  FavoriteRestaurantControllers.add,
);

router.delete('/delete-all', FavoriteRestaurantControllers.deleteAll);

router.delete(
  '/:favRestaurantId/delete',
  purifyRequest(QueryValidations.exists('favRestaurantId', FavoriteRestaurant)),
  FavoriteRestaurantControllers.delete,
);

export const FavoriteRestaurantRoutes = router;
