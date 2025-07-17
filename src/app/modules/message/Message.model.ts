import { model, Schema } from 'mongoose';
import { TCard, TMessage } from './Message.interface';

const recommendationSchema = new Schema<TCard>(
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
    recommendations: [recommendationSchema],
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
