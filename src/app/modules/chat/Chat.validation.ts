import { z } from 'zod';

export const ChatValidations = {
  rename: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
    }),
  }),
};
