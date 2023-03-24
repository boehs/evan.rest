import { Hono } from 'hono'
import { heartbeat } from "./heartbeat"

const app = new Hono({strict: false})
app.route('',heartbeat)

app.get('/time', async c => {
  return c.text((new Date()).toLocaleTimeString(undefined, {
    timeZone: 'America/New_York'
  }))
})

export default app