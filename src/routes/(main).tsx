import { getHeartbeat } from "../../lib/heartbeat"
import { A, Outlet, Title, useLocation } from "solid-start"
import { createServerData$ } from "solid-start/server"

export function routeData() {
  return {
    heartbeat: createServerData$(async (_, { env }) => {
      return await getHeartbeat(env as Bindings)
    })
  }
}

export type hb = typeof routeData

export default function Main() {
  const url = () => useLocation().pathname.split('/').slice(-1)

  return <>
    <nav>
      <A href="/">{'<'} Back</A> &bull; <h1>{url()}</h1>
    </nav>
    <Outlet />
  </>
}