import { For, Show } from "solid-js"
import { A, Title } from "solid-start"
import Logo from "~/components/logo"
import { Time } from "./(main)/time"

const routes = {
  basic: [['ping', 'pong']],
  vitals: [['time', <Time />], 'asleep', 'heartbeat'],
//  transcend: [['windchime', '🎐']]
}

const messages = [
  "Now with 100% less caffeine",
  "She stared at the stars like they were pillow for her mind and in their light she could rest her heavy head.",
  "I pray this winter be gentle and kind - a season of rest from the wheel of the mind",
  "He sought out cold waterfalls, small thick forests, and thought about nothing at all.",
  "Is it possible to find silence in the midst of today's noisy world?",
  "A restless mind makes a problem of a resting body."
]

export default function Home() {
  return <main>
    <Title>Home</Title>
    <Logo />
    <p class="MOTD">{messages[messages.length * Math.random() | 0]}</p>
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
  </main>
}
