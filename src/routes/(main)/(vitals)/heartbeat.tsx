import Schema from "~/components/schema"
import { useRouteData } from "solid-start"
import { hb } from "~/routes/(main)"


export default function Heartbeat() {
  const { heartbeat } = useRouteData<hb>()
  return <>
    <main>
      <p>
        When you go to a website with spooky trackers, your browser's heart begins to beat.
        At intervals, it sends statistics back!
        My computer has it's own heart, I guess.
        It last beat <b>{() => Math.round((Date.now() - heartbeat()?.beat!) / 1000 / 60) } minutes</b> ago
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