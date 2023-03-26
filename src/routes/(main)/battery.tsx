import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

export function routeData() {
    return {
        battery: createServerData$(async (_, { env }) => {
            const beats = await (env as Bindings).RESTFUL.get<Heartbeat[]>('heartbeat', "json")
            const ranges = beats?.map(beat => [
                Math.round((Date.now() - beat.beat) / 1000 / 60 / 5),
                beat.data.device.battery || 100])
            return ranges
        })
    }
}

export default function Main() {
    const { battery } = useRouteData<typeof routeData>()
    const computedPoints = () => battery()?.map(b => {
        let be = JSON.parse(JSON.stringify(b))
        be[0] = 288 - b[0]
        be[1] = 102 - b[1]
        return be.join(',')
    }).join(' ')
    console.log(computedPoints())
    return <>
        <main>
            <p>
                My current laptop's battery level is <b>{(battery() || [[0,100]])[0][1]}%</b>.
                Below is a graph of my battery level for the last 24 hours.
            </p>
            <svg viewBox="0 0 288 102" class="chart">
                <polyline
                    fill="none"
                    stroke="#b428b4"
                    stroke-width="2"
                    points={computedPoints()}/>
            </svg>
        </main>
    </>
}