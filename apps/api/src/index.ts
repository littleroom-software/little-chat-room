import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { user } from './services/user'

type Bindings = {
  DB: D1Database
}

const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.route('/users', user)

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})

app.get('/ui', swaggerUI({ url: '/doc' }))

export default app
