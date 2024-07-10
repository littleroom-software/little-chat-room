import { z } from '@hono/zod-openapi'

export const UserSchema = z
  .object({
    id: z.string().openapi({
      example: '123',
    }),
    name: z.string().openapi({
      example: 'John Doe',
    }),
    email: z.string().email().openapi({
      example: 'johndoe@example.com',
    }),
    password: z.string().openapi({
      example: 'password',
    }),
    created_at: z.string().openapi({
      example: '2021-09-01T00:00:00Z',
    }),
    updated_at: z.string().openapi({
      example: '2021-09-01T00:00:00Z',
    }),
  }).openapi('User')

export type User = z.infer<typeof UserSchema>