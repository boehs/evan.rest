import { createSignal, onCleanup, onMount, Show } from "solid-js"
import Schema from "~/components/schema"

export function Time() {
  const [time, setTime] = createSignal(Date.now())
  let int: NodeJS.Timer

  onMount(() => {
    int = setInterval(() => setTime(Date.now()), 1000)
  })

  onCleanup(() => {
    clearInterval(int)
  })

  const myTime = () => (new Date(time())).toLocaleTimeString(undefined, {
    timeZone: 'America/New_York'
  })

  return <span>{myTime()}</span>
}

export default function TimeRoute() {
  const [time, setTime] = createSignal(Date.now())
  let int: NodeJS.Timer

  onMount(() => {
    int = setInterval(() => setTime(Date.now()), 1000)
  })

  onCleanup(() => {
    clearInterval(int)
  })

  const myTime = () => (new Date(time())).toLocaleTimeString(undefined, {
    timeZone: 'America/New_York'
  })
  const myTzOff = 240

  const total = () => (myTzOff - (new Date()).getTimezoneOffset()) / 60

  const yourTime = () => (new Date(time())).toLocaleTimeString()

  const same = () => myTime() == yourTime()

  return <>
    <main>
      <p>At my home, the time is</p>
      <p>{myTime()}</p>
      <Show when={!same()} fallback={<p>At yours, it is <b>the same</b></p>}>
        <p>At yours, it is</p>
        <p>{yourTime()}</p>
        <p>You are {Math.abs(total())} hours {Math.sign(total()) == -1 ? 'behind' : 'ahead of'} me.</p>
      </Show>
    </main>
    <Schema routes={[
      ['GET', 'time', 'Get my time!', 'My time, 12 hour with AM/PM'],
      ['GET', 'time/diff', 'Get the difference between our times', 'The number of hours.']
    ]} />
  </>
} 