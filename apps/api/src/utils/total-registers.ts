import { Context } from "hono"

type Bindings = {
  DB: D1Database
}

export async function totalRegisters(c: Context<{ Bindings: Bindings }>, tableName: string) {
  const { results } = await c.env.DB
    .prepare(`SELECT COUNT(*) FROM ${tableName}`)
    .all()

  return results[0]['COUNT(*)'] as number
}