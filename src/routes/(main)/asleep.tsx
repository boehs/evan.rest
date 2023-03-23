import Checklist from "~/components/checklist"
import Schema from "~/components/schema"
import { NotLive } from "~/components/warnings"

export default function Asleep() {
  const hour = Number((new Date()).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: '2-digit', hour12: false }).replace(/ AM| PM/, ''))

  return <>
    <main>
      <h2>Is Evan Asleep? 💤</h2>
      <p><b>No!</b>*</p>
      <p>*If my computer is running, Every 10 minutes it pings `evan.rest/heartbeat` with some cool statistics.</p>
      <p>Generally, I'd say my sleeping hours are 10PM-7AM, so if my time is in that range *and* there hasn't been a heartbeat for more than 10 minutes, I'm probably asleep 😅</p>
      <Checklist list={[
        [hour > 22 || hour < 7, '10PM-7AM']
      ]} />
      <NotLive />
    </main>
    <Schema routes={[
      ['GET', 'asleep', 'Check if I am likely asleep', "'yes!' (503) or 'no!' (200)"]
    ]} />
  </>
}