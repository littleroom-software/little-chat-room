import { createRoute, z } from '@hono/zod-openapi'

const UserSchema = z
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

export const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
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
  path: '/users',
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
