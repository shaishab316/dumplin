import { z } from 'zod';

export const FavoriteRestaurantValidations = {
  add: z.object({
    body: z.object({
      name: z
        .string({ required_error: 'Name is required' })
        .min(1, 'Name is required'),
      cuisine: z.string().optional(),
      price_range: z.string().optional(),
      rating: z.number().optional(),
      phone: z.string().optional(),
      website: z.string().optional(),
      location: z.string().optional(),
      coordinates: z.array(z.number()).optional(),
    }),
  }),

  isFavorite: z.object({
    query: z.object({
      restaurantName: z
        .string({
          required_error: 'Restaurant Name is required',
        })
        .min(1, 'Restaurant Name is required'),
    }),
  }),
};
