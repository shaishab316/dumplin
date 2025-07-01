import { z } from 'zod';
import { EUserRole } from './User.enum';

export const UserValidations = {
  createUser: z.object({
    body: z.object({
      name: z
        .string({
          required_error: 'Name is missing',
        })
        .min(1, 'Name is missing'),
      email: z
        .string({
          required_error: 'Email is missing',
        })
        .email('Give a valid email'),
      password: z
        .string({
          required_error: 'Password is missing',
        })
        .min(6, 'Password must be at least 6 characters long'),
      role: z.literal(EUserRole.USER).default(EUserRole.USER),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      avatar: z.string().optional(),
      phone: z.string().optional(),
    }),
  }),

  cngPass: z.object({
    body: z.object({
      oldPassword: z
        .string({
          required_error: 'Old Password is missing',
        })
        .min(1, 'Old Password is required')
        .min(6, 'Old Password must be at least 6 characters long'),
      newPassword: z
        .string({
          required_error: 'New Password is missing',
        })
        .min(1, 'New Password is required')
        .min(6, 'New Password must be at least 6 characters long'),
    }),
  }),

  list: z.object({
    query: z.object({
      search: z.string().trim().optional(),
    }),
  }),
};
