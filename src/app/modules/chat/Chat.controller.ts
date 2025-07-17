import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { ChatServices } from './Chat.service';

export const ChatControllers = {
  create: catchAsync(async ({ user }, res) => {
    const chat = await ChatServices.create(user._id);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Chat created successfully',
      data: {
        session_id: chat._id,
      },
    });
  }),

  rename: catchAsync(async (req, res) => {
    const data = await ChatServices.rename(req.params.chatId, req.body.name);

    serveResponse(res, {
      message: 'Chat renamed successfully',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    await ChatServices.delete(params.chatId);

    serveResponse(res, {
      message: 'Chat deleted successfully',
    });
  }),

  clear: catchAsync(async (req, res) => {
    await ChatServices.clear(req.user!._id!);

    serveResponse(res, {
      message: 'Chat cleared successfully',
    });
  }),

  list: catchAsync(async ({ query, user }: any, res) => {
    query.user = user._id;

    const { chats, meta } = await ChatServices.list(query);

    serveResponse(res, {
      message: 'Chats fetched successfully',
      meta,
      data: chats,
    });
  }),
};
