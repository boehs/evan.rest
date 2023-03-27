import { Hono } from 'hono'
import { getHeartbeat } from "../lib/heartbeat"
import { hour } from "~/routes/(main)/(vitals)/asleep"
import { heartbeat } from "./heartbeat"

const app = new Hono<{
  Bindings: {
    RESTFUL: KVNamespace,
    PW: string
  },
}>({strict: false})
app.route('',heartbeat)

app.get('/time', async c => {
  return c.text((new Date()).toLocaleTimeString(undefined, {
    timeZone: 'America/New_York'
  }))
})

app.get('/asleep', async c => {
  const isAsleep = (hour >= 22 || hour <= 7) && Date.now() - (await getHeartbeat(c.env))?.beat! > 1000 * 60 * 10
  if (isAsleep) return c.newResponse('yes!', 200)
  else return c.newResponse('no!')
})

app.get('/battery', async c => {
  return c.text(String((await getHeartbeat(c.env))?.data.device.battery))
})

export default app