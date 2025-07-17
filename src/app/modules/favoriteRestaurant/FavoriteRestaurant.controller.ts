import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { FavoriteRestaurantServices } from './FavoriteRestaurant.service';

export const FavoriteRestaurantControllers = {
  isFavorite: catchAsync(async ({ query, user }, res) => {
    const isFavorite = !!(await FavoriteRestaurantServices.isFavorite(
      query.restaurantName,
      user._id,
    ));

    serveResponse(res, {
      message: isFavorite ? 'Favorite' : 'Not favorite',
      data: { isFavorite },
    });
  }),

  add: catchAsync(async ({ body, user }, res) => {
    await FavoriteRestaurantServices.add({
      restaurant: body,
      user: user._id,
    });

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Favorite restaurant added successfully',
    });
  }),

  list: catchAsync(async ({ query, user }, res) => {
    const { meta, favRestaurants } = await FavoriteRestaurantServices.list(
      user._id,
      query,
    );

    serveResponse(res, {
      message: 'Favorite restaurants fetched successfully',
      meta,
      data: favRestaurants.map(({ restaurant, _id }) => ({
        _id,
        ...restaurant,
      })),
    });
  }),

  retrieve: catchAsync(async ({ params }, res) => {
    const favRestaurant = await FavoriteRestaurantServices.retrieve(
      params.favRestaurantId,
    );

    serveResponse(res, {
      message: 'Favorite restaurant fetched successfully',
      data: favRestaurant?.restaurant,
    });
  }),

  delete: catchAsync(async ({ params, user }, res) => {
    await FavoriteRestaurantServices.delete(params.favRestaurantId, user._id);

    serveResponse(res, {
      message: 'Favorite restaurant deleted successfully',
    });
  }),

  deleteAll: catchAsync(async ({ user }, res) => {
    await FavoriteRestaurantServices.deleteAll(user._id);

    serveResponse(res, {
      message: 'All favorite restaurants deleted successfully',
    });
  }),
};
