import { model, Schema } from 'mongoose';
import { TRestaurant, TMessage } from './Message.interface';

export const restaurantSchema = new Schema<TRestaurant>(
  {
    name: String,
    cuisine: String,
    price_range: String,
    rating: Number,
    phone: String,
    website: String,
    location: String,
    coordinates: [Number],
  },
  { _id: false },
);

const messageSchema = new Schema<TMessage>(
  {
    session_id: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    user_message: String,
    bot_response: String,
    recommendations: [restaurantSchema],
    hasRecommendations: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Message = model<TMessage>('Message', messageSchema);

export default Message;
