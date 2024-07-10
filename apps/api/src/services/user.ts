import { v4 as uuidv4 } from 'uuid'
import { createUserRoute, getUsersRoute } from "../routes/user"
import { User } from '../schemas/user'
import { totalRegisters } from '../utils/total-registers'
import { OpenAPIHono } from '@hono/zod-openapi'

type Bindings = {
  DB: D1Database
}

export const user = new OpenAPIHono<{ Bindings: Bindings }>()

user.openapi(createUserRoute, async (c) => {
  const body = c.req.valid("json")

  const user = {
    id: uuidv4(),
    name: body.name,
    email: body.email,
    password: body.password,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  await c.env.DB
    .prepare('INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
    .bind(...Object.values(user))
    .run()

  return c.json(user, 201)
})

user.openapi(getUsersRoute, async (c) => {
  const { page, perPage } = c.req.valid("query")

  const { results } = await c.env.DB
    .prepare('SELECT * FROM users LIMIT ?1 OFFSET ?2')
    .bind(perPage, (page - 1) * perPage)
    .all<User>()

  const total = await totalRegisters(c, 'users')

  return c.json({
    results,
    meta: {
      page,
      perPage,
      currentPage: page,
      total,
      totalPages: Math.ceil(total / perPage),
    }
  }, 200)
})
