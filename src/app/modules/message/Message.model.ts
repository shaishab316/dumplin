import { model, Schema } from 'mongoose';
import { TMessage } from './Message.interface';

const messageSchema = new Schema<TMessage>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    cards: [
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Message = model<TMessage>('Message', messageSchema);

export default Message;
