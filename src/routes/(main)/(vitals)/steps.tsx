import { RouteDataArgs, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"

export function routeData(e: RouteDataArgs) {
    return {
        activity: createServerData$(async (_, { env }) => {
            let hb = (await (env as Bindings).RESTFUL.get<Mobleet>('mobleet', "json"))!

            console.log(((Date.now()/1000) - hb.steps[0][0]) / 1000)

            const ranges = hb.steps.map(sample => [
                Math.round((Date.now() - (sample[0] * 1000)) / 1000 / 60 / 8),sample[1]/150])
            const forSvg = ranges?.map(beat => {
                beat[0] = 288-beat[0]
                beat[1] = 102 - beat[1]
                return beat
            })

            return {
                last: hb.steps[hb.steps.length - 1][1],
                svg: forSvg
            }
        })
    }
}

export default function Steps() {
    const { activity } = useRouteData<typeof routeData>()

    const computedPoints = () => activity()?.svg.map(b => b.join(',')).join(' ')
    return <>
        <main>
            <p>How many steps have I taken in the last 24 hours?</p>
            <p><b>{activity()?.last}</b> steps is how many!</p>
            <hr />
            <p>And here is a graph</p>
            <svg viewBox="0 0 288 102" class="chart">
                <defs>
                    <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stop-color="rgba(180, 40, 180, 50%)"/>
                        <stop offset="100%" stop-color="rgba(180, 40, 180, 0%)" />
                    </linearGradient>
                </defs>
                <polyline
                    fill="none"
                    stroke="#b428b4"
                    stroke-width="1"
                    points={computedPoints()} />
                <polyline
                    fill="url(#bg)"
                    points={`288,102 ${computedPoints()} 0,102`} />
            </svg>
        </main>
    </>
}
