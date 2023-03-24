import { Hono } from 'hono'
import { heartbeat } from "./heartbeat"

const app = new Hono({strict: false})
app.route('',heartbeat)

export default app