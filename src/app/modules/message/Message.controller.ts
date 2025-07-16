import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { MessageServices } from './Message.service';

export const MessageControllers = {
  ask: catchAsync(async ({ params, body, query }, res) => {
    const data = await MessageServices.ask(params.chatId, {
      ...body,
      ...query,
    });

    serveResponse(res, {
      message: 'Bot response successfully',
      data,
    });
  }),

  list: catchAsync(async ({ query, params }, res) => {
    query.session_id = params.chatId;

    const { messages, meta } = await MessageServices.list(query);

    serveResponse(res, {
      message: 'Messages fetched successfully',
      meta,
      data: messages.reverse(),
    });
  }),
};
