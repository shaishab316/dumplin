import { Types } from 'mongoose';
import { TRestaurant } from '../message/Message.interface';

export type TFavoriteRestaurant = {
  _id?: Types.ObjectId;

  user: Types.ObjectId;
  restaurant: TRestaurant;

  createdAt?: Date;
  updatedAt?: Date;
};
