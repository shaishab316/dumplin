import { Types } from 'mongoose';

export type TChat = {
  user: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
