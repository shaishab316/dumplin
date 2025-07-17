import { Types } from 'mongoose';
import { TFavoriteRestaurant } from './FavoriteRestaurant.interface';
import FavoriteRestaurant from './FavoriteRestaurant.model';
import { TList } from '../query/Query.interface';
import { TPagination } from '../../../util/server/serveResponse';

export const FavoriteRestaurantServices = {
  async add(favoriteRestaurantData: TFavoriteRestaurant) {
    return FavoriteRestaurant.create(favoriteRestaurantData);
  },

  async delete(favoriteRestaurantId: Types.ObjectId, user: Types.ObjectId) {
    return FavoriteRestaurant.findOneAndDelete({
      _id: favoriteRestaurantId,
      user,
    });
  },

  async deleteAll(user: Types.ObjectId) {
    return FavoriteRestaurant.deleteMany({ user });
  },

  async list(user: Types.ObjectId, { page, limit }: TList) {
    const favRestaurants = await FavoriteRestaurant.find({ user })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await FavoriteRestaurant.countDocuments({ user });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } as TPagination,
      },
      favRestaurants,
    };
  },

  async retrieve(favoriteRestaurantId: Types.ObjectId) {
    return FavoriteRestaurant.findById(favoriteRestaurantId).lean();
  },
};
