import { Hono } from "hono"
import { getHeartbeat } from "../lib/heartbeat"

const app = new Hono<{
  Bindings: {
    RESTFUL: KVNamespace,
    PW: string
  },
}>({ strict: false })

app.get('/heartbeat', async c => {
  return c.jsonT(await getHeartbeat(c.env))
})

app.post('/heartbeat', async c => {
  if (c.req.headers.get('Authorization') == c.env.PW) {
    await c.env.RESTFUL.put('heartbeat', JSON.stringify({
      beat: Date.now(),
      data: await c.req.json()
    }))
    return c.newResponse(null,200)
  }
  return c.newResponse(null,400)
})

export const heartbeat = app