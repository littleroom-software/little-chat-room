import { createRoute, z } from '@hono/zod-openapi'
import { UserSchema } from '../schemas/user'

export const createUserRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: UserSchema.omit({ id: true, created_at: true, updated_at: true })
        },
      },
      description: 'The user to create',
      required: true
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'The user was created',
    },
  },
})

export const getUsersRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: z.object({
      page: z.coerce.number().default(1).openapi({
        example: 1,
      }),
      perPage: z.coerce.number().default(10).openapi({
        example: 10,
      }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            results: z.array(UserSchema),
            meta: z.object({
              total: z.number(),
              currentPage: z.number(),
              totalPages: z.number(),
            })
          }),
        },
      },
      description: 'The list of users',
    },
  },
})
