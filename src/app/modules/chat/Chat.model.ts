import { model, Schema } from 'mongoose';
import { TChat } from './Chat.interface';
import { ChatMiddlewares } from './Chat.middleware';

const chatSchema = new Schema<TChat>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: String,
  },
  { timestamps: true, versionKey: false },
);

chatSchema.plugin(ChatMiddlewares.schema);

const Chat = model<TChat>('Chat', chatSchema);

export default Chat;
