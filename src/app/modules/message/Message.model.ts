import { model, Schema } from 'mongoose';
import { TMessage } from './Message.interface';

const messageSchema = new Schema<TMessage>(
  {
    session_id: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    user_message: String,
    bot_response: String,
    recommendations: [
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
    ],
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
