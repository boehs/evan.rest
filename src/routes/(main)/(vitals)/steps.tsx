import { useRouteData } from "solid-start"
import { hb } from "~/routes/(main)"

export default function Steps() {
    const { heartbeat } = useRouteData<hb>()
    return <>
        <main>
            <p>How many steps have I taken today?</p>
            <p><b>{heartbeat()?.data.activity.steps}</b> steps and <b>{heartbeat()?.data.activity.floors}</b> flights of stairs is how many!</p>
            <hr/>
            <p>
                This statistic is provided through a reverse engineered garmin connect
                API. I didn't want to reverse engineer it, who wants to put such a valuable
                account at risk, but... funsies?
            </p>
            <p>
                I'm kinda bouncing back and forth on if it's worth it. I also
                have something with metriport that isn't risky, but they can only use WS for garmin
                which is a drag.
            </p>
            <p>
                Speaking of, all this is reminding me of karlicoss' <a href="https://github.com/karlicoss/HPI">HPI</a>.
                I suppose, in a way, this site is my own little HPI.
                Isn't that fun? I'd like to continue playing with HPIs in the future.
            </p>
        </main>
    </>
}
