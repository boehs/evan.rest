import { getHeartbeat } from "../../lib/heartbeat"
import { For, Show } from "solid-js"
import { A, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import Footer from "~/components/foot"
import Logo from "~/components/logo"
import { Time } from "./(main)/(vitals)/time"
import { isAsleep } from "./(main)/(vitals)/asleep"
import { mAgo } from "./(main)/(tech)/heartbeat"
import { run } from "../../backend/weather"

const messages = [
  "Now with 100% less caffeine",
  "She stared at the stars like they were pillow for her mind and in their light she could rest her heavy head.",
  "I pray this winter be gentle and kind - a season of rest from the wheel of the mind",
  "He sought out cold waterfalls, small thick forests, and thought about nothing at all.",
  "Is it possible to find silence in the midst of today's noisy world?",
  "A restless mind makes a problem of a resting body.",
  "In today's rush we all think too much, seek too much, want too much and forget about the joy of just Being.",
  "Rest is not idleness, and to lie sometimes on the grass under trees on a summer's day, listening to the murmur of the water, or watching the clouds float across the sky, is by no means a waste of time.",
  "Don't underestimate the value of doing nothing, of just going along, listening to all the things you can't hear, and not bothering.",
  "Almost everything will work again if you unplug it for a few minutes, including you.",
  "Exist slowly, softly, like the trees",
  "You're only here for a short visit. Don't hurry, don't worry. And be sure to smell the flowers along the way."
]

export function routeData() {
  return {
    heartbeat: createServerData$(async (_, { env }) => {
      return await getHeartbeat(env as Bindings)
    })
  }
}

export default function Home() {
  const { heartbeat } = useRouteData<typeof routeData>()
  const routes = {
    basic: [['ping', 'pong'], 'about'],
    vitals: [
      ['time', <Time />],
      ['asleep', <>{isAsleep() ? 'Yes' : 'No'}!</>],
      ['weather', () => heartbeat()! ? run(heartbeat()!).word : ''],
      ['steps', "more than one!"]
    ],
    tech: [
      ['heartbeat', () => mAgo(heartbeat()?.beat!) + ' minutes ago'],
      ['battery', () => heartbeat.loading ? '' : `${heartbeat()?.data.device.battery.level}% and ${heartbeat()?.data.device.battery.status}`],
      ['music', <Show when={heartbeat()?.data.music} fallback="🔇">
        {heartbeat()?.data.music?.artist} &bull; <a href={heartbeat()?.data.music?.url}>{heartbeat()?.data.music?.track}</a>
      </Show>],
      //'session'
    ],
    //transcend: [['windchime', '🎐']],
    tools: [
      ['go', 'away']
    ]
  }

  return <main>
    <Logo />
    <p class="sup">{messages[messages.length * Math.random() | 0]}</p>
    <For each={Object.entries(routes)}>
      {([section, subroutes]) => <>
        <h2 class="small">{section}</h2>
        <ul>
          <For each={subroutes}>
            {(subroute) => <li>
              <Show when={typeof subroute == 'object'} fallback={<A href={`/${subroute}`}>/{subroute}</A>}>
                <A href={`/${subroute[0]}`}>/{subroute[0]}</A>: {subroute[1]}
              </Show>
            </li>}
          </For>
        </ul>
      </>}
    </For>
    <h2 class="small">✲✲✲</h2>
    <Footer />
  </main>
}
