import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { getHeartbeat } from "../lib/heartbeat"
import { hour } from "~/routes/(main)/(vitals)/asleep"
import { heartbeat } from "./heartbeat"
import { getWeatherDesc, normalizeDesc } from './weather'

const app = new Hono<{
  Bindings: {
    RESTFUL: KVNamespace,
    PW: string
  },
}>({strict: false})
app.use('*', prettyJSON())

app.route('',heartbeat)

app.get('/time', async c => {
  return c.text((new Date()).toLocaleTimeString(undefined, {
    timeZone: 'America/New_York'
  }))
})

app.get('/asleep', async c => {
  const isAsleep = (hour >= 22 || hour <= 7) && Date.now() - (await getHeartbeat(c.env))?.beat! > 1000 * 60 * 10
  if (isAsleep) return c.jsonT(true, 503)
  else return c.jsonT(false, 200)
})

app.get('/battery', async c => {
  return c.jsonT((await getHeartbeat(c.env)).data.device.battery)
})

app.get('/battery/history', async c => {
  const beats = await c.env.RESTFUL.get<Heartbeat[]>('heartbeat', 'json')
  const battery = beats?.map(beat => [beat.beat,beat.data.device.battery])
  return c.jsonT(Object.fromEntries(battery || []))
})

app.get('/music', async c => {
  return c.jsonT((await getHeartbeat(c.env))?.data.music)
})

app.get('/music/history', async c => {
  const beats = await c.env.RESTFUL.get<Heartbeat[]>('heartbeat', 'json')
  const music = beats?.filter(beat => beat.data.music).map(beat => ([beat.beat, beat.data.music!]))
  return c.jsonT(Object.fromEntries(music || []))
})

app.get('/weather', async c => {
  const w = (await getHeartbeat(c.env))?.data.weather
  const parsed = normalizeDesc(w.icon)
  const word = getWeatherDesc(parsed, w.temp, w.speed)
  return c.jsonT({
    word: word,
    temp: w.temp,
    desc: parsed
  })
})

export default app
