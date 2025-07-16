import { z } from 'zod';

export const MessageValidations = {
  chat: z.object({
    body: z.object({
      question: z.string().min(1, 'Question is required'),
    }),
    query: z.object({
      latitude: z.coerce
        .number()
        .min(-90, 'Invalid latitude')
        .max(90, 'Invalid latitude')
        .optional(),
      longitude: z.coerce
        .number()
        .min(-180, 'Invalid longitude')
        .max(180, 'Invalid longitude')
        .optional(),
    }),
  }),
};
