import { Schema, model } from 'mongoose';
import { TFavoriteRestaurant } from './FavoriteRestaurant.interface';
import { restaurantSchema } from '../message/Message.model';

const favoriteRestaurantSchema = new Schema<TFavoriteRestaurant>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurant: restaurantSchema,
  },
  { timestamps: true, versionKey: false },
);

const FavoriteRestaurant = model<TFavoriteRestaurant>(
  'FavoriteRestaurant',
  favoriteRestaurantSchema,
);

export default FavoriteRestaurant;
