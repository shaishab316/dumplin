import Message from './Message.model';
import { TList } from '../query/Query.interface';
import { Types } from 'mongoose';
import { TPagination } from '../../../util/server/serveResponse';
import config from '../../../config';
import axios from 'axios';
import { TMessage } from './Message.interface';
import Chat from '../chat/Chat.model';

export const MessageServices = {
  async ask(sessionId: Types.ObjectId, { question, longitude, latitude }: any) {
    const aiUrl = new URL(config.url.ai + '/ask');

    aiUrl.searchParams.set('session_id', sessionId.toString());
    if (longitude && latitude) {
      aiUrl.searchParams.set('longitude', longitude);
      aiUrl.searchParams.set('latitude', latitude);
    }

    const { data } = await axios.post(aiUrl.toString(), { question });

    const messageData: TMessage = {
      session_id: sessionId,
      user_message: question,
      bot_response: data.answer,
    };

    if (data.type === 'json') {
      try {
        const jsonData = JSON.parse(
          data.answer.split('```json')[1]?.split('```')[0] || '{}',
        );

        messageData.recommendations = jsonData?.recommendations || [];
        messageData.bot_response =
          jsonData?.user_readable_response || 'I have found these restaurants:';
        messageData.hasRecommendations = true;

        const chatTitle = jsonData.chat_title.trim();

        if (chatTitle)
          await Chat.findByIdAndUpdate(sessionId, {
            name: chatTitle,
          });
      } catch {
        messageData.bot_response = "I couldn't find any restaurants.";
        messageData.recommendations = [];
      }
    } else {
      await Chat.findByIdAndUpdate(sessionId, {
        name: messageData.bot_response.slice(0, 50),
      });
    }

    return Message.create(messageData);
  },

  async list({
    session_id,
    page,
    limit,
  }: TList & { session_id: Types.ObjectId }) {
    const messages = await Message.find({ session_id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-chat')
      .lean();

    const total = await Message.countDocuments({ session_id });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } as TPagination,
      },
      messages,
    };
  },

  genTitle(response: string) {
    const rawLine = response.split('\n').find(line => line.trim());

    if (!rawLine) return '';

    // Step 1: Clean markdown (*, **, _, __)
    const title = rawLine
      .replace(/(\*\*|\*|__|_)(.*?)\1/g, '$2')
      .replace(/[(){}[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Step 2: Try to find a full sentence ending (. ? !) within 50 chars
    const match = title.match(/^(.{1,50}?[.?!])\s/);

    if (match) return match[1].trim();

    // Step 3: Otherwise just slice to 50 chars
    return title.slice(0, 50).trim();
  },
};
