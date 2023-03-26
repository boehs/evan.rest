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
    return <>
        <main>
            <p>
                My current laptop's battery level is <b>{(battery() || [[0,100]])[0][1]}%</b>.
                Below is a graph of my battery level for the last 24 hours.
            </p>
            <svg viewBox="0 0 288 100" class="chart">
                <polyline
                    fill="none"
                    stroke="#b428b4"
                    stroke-width="2"
                    points={battery()?.reverse().map(b => {
                        b[1] = 100 - b[1]
                        return b.join(',')
                    }).join(' ')}/>
            </svg>
        </main>
    </>
}