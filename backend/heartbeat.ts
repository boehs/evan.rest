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

const day = 86400000 as const

app.post('/heartbeat', async c => {
  console.log(c.env.PW, c.req.headers.get('Authorization'))
  if (c.req.headers.get('Authorization') == c.env.PW) {
    const allBeats = await c.env.RESTFUL.get<Heartbeat[]>('heartbeat', 'json')
    const filtered = (allBeats || []).filter(beat => Date.now() < beat.beat + day)
    await c.env.RESTFUL.put('heartbeat', JSON.stringify([
      {
        beat: Date.now(),
        data: await c.req.json()
      },
      ...filtered
    ]))
    return c.newResponse(null, 200)
  }
  return c.newResponse(null, 400)
})

export const heartbeat = app