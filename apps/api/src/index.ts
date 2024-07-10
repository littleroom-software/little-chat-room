import { OpenAPIHono } from '@hono/zod-openapi'
import { createUserRoute, getUsersRoute, User } from './routes/user'
import { v4 as uuidv4 } from 'uuid'
import { swaggerUI } from '@hono/swagger-ui'
import { totalRegisters } from './utils/total-registers'

type Bindings = {
  DB: D1Database
}

const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.openapi(createUserRoute, async (c) => {
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

app.openapi(getUsersRoute, async (c) => {
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

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})

app.get('/ui', swaggerUI({ url: '/doc' }))

export default app
