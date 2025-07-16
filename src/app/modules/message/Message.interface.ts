import { Types } from 'mongoose';
import { TCoordinates } from '../../../types/location';

export type TMessage = {
  _id?: Types.ObjectId;

  chat: Types.ObjectId;
  content: string;
  cards?: TCard[];
  sender: 'user' | 'bot';

  createdAt?: Date;
  updatedAt?: Date;
};

export type TCard = {
  name: string;
  cuisine: string;
  price_range: string;
  rating: number;
  phone: string;
  website: string;
  location: string;
  coordinates: TCoordinates;
};
