import { getHeartbeat } from "../../../lib/heartbeat"
import { createServerData$, PageEvent } from "solid-start/server"
import Schema from "~/components/schema"
import { useRouteData } from "solid-start"


export function routeData() {
  return {
    heartbeat: createServerData$(async (_, { env }) => {
      return await getHeartbeat(env as Bindings)
    })
  }
}

export default function Heartbeat() {
  const { heartbeat } = useRouteData<typeof routeData>()
  return <>
    <main>
      <p>
        When you go to a website with spooky trackers, your browser's heart begins to beat.
        At intervals, it sends statistics back!
        My computer has it's own heart, I guess.
      </p>
      <pre>{JSON.stringify(heartbeat(), null, 2)}</pre>
      <p>Various other routes are built upon this, including /battery, /np, and /asleep</p>
    </main>
    <Schema routes={[
      ['GET', 'heartbeat', "Get my last heartbeat", 'See left'],
      ['POST', 'heartbeat', {
        description: "Update the heartbeat",
        protected: true
      }, '200']
    ]}
    />
  </>
}