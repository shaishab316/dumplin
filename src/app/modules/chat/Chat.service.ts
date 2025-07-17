import { Types } from 'mongoose';
import Chat from './Chat.model';
import { useSession } from '../../../util/db/session';
import Message from '../message/Message.model';
import { TPagination } from '../../../util/server/serveResponse';

export const ChatServices = {
  async create(user: Types.ObjectId) {
    return Chat.create({ user });
  },

  async rename(chatId: string, name: string) {
    return Chat.findByIdAndUpdate(chatId, { name }, { new: true });
  },

  async delete(chat: Types.ObjectId) {
    return useSession(async session => {
      return Promise.all([
        Chat.findByIdAndDelete(chat).session(session),
        Message.deleteMany({ session_id: chat }).session(session),
      ]);
    });
  },

  async clear(user: Types.ObjectId) {
    const chats = await Chat.find({ user }).select('_id');
    return Promise.allSettled(chats.map(({ _id }) => this.delete(_id)));
  },

  async list({ user, page, limit }: Record<string, any>) {
    const chats = await Chat.find({ user })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Chat.countDocuments({ user });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } as TPagination,
      },
      chats,
    };
  },
};
