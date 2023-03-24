import { useRouteData } from "solid-start"
import Checklist from "~/components/checklist"
import Schema from "~/components/schema"
import { NotLive } from "~/components/warnings"
import { hb } from "~/routes/(main)"

export const hour = Number((new Date()).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: '2-digit', hour12: false }).replace(/ AM| PM/, ''))
export const isAsleep = () => (hour > 22 || hour < 7) && Date.now() - useRouteData<hb>().heartbeat()?.beat! > 1000 * 60 * 10

export default function Asleep() {
  return <>
    <main>
      <h2>Is Evan Asleep? 💤</h2>
      <p><b>{() => isAsleep() ? 'Yes!' : 'No!'}</b>*</p>
      <p>*If my computer is running, Every 10 minutes it sends a heartbeat.</p>
      <p>Generally, I'd say my sleeping hours are 10PM-7AM, so if my time is in that range *and* there hasn't been a heartbeat for more than 10 minutes, I'm probably asleep 😅</p>
      <Checklist list={[
        [hour > 22 || hour < 7, '10PM-7AM'],
        [Date.now() - useRouteData<hb>().heartbeat()?.beat! > 1000 * 60 * 10, 'More than 10 minutes']
      ]} />
    </main>
    <Schema routes={[
      ['GET', 'asleep', 'Check if I am likely asleep', "'yes!' (503) or 'no!' (200)"]
    ]} />
  </>
}