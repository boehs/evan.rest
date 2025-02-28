import { createResource, For } from "solid-js";
import { createRouteData, useRouteData } from "solid-start";
import server$, { createServerData$ } from "solid-start/server";
import Schema from "~/components/schema";

export function routeData() {
    return {
        battery: createServerData$(async (_, { env }) => {
            const beats = await (env as Bindings).RESTFUL.get<Heartbeat[]>('heartbeat', "json")
            const ranges = beats?.map(beat => [
                Math.round((Date.now() - beat.beat) / 1000 / 60 / 5),
                typeof beat.data.device.battery == 'number' || beat.data.device.battery == null ? (beat.data.device.battery || 100) : beat.data.device.battery.level])
            const forSvg = ranges?.map(beat => {
                beat[0] = 288 - beat[0]
                beat[1] = 102 - beat[1]
                return beat
            })
            return forSvg
        }),
        ranges: createRouteData(
            async () => {
                return Object.entries(await (await server$.fetch('/api/battery/ranges')).json())
                    .map(([k, v]) => [k, v.map((arr: number[]) => arr.map(n => Math.round((Date.now() - n) / 1000 / 60 / 5)))])
                    .flatMap(([k, v]) => v.map(v => [k, ...v]))
            })
    }
}

export default function Main() {
    const { battery, ranges } = useRouteData<typeof routeData>()
    const computedPoints = () => battery()?.map(b => b.join(',')).join(' ')
    return <>
        {JSON.stringify(ranges())}
        <main>
            <p>
                My laptop's current battery level is <b>{102 - (battery() || [[0, 100]])[0][1]}%</b>.
                Below is a graph of my battery level for the last 24 hours.
            </p>
            <svg viewBox="0 0 288 102" class="chart">
                <defs>
                    <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stop-color="rgba(180, 40, 180, 50%)" />
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
                <For each={ranges()}>
                    {range => <line x1={288-range[1]} x2={288 - range[2] || 288} y1="102" y2="102" stroke-width={2} stroke={range[0] == 'charging' ? '#28b449' : '#b42834'}/>}
                </For>
            </svg>
        </main>
        <Schema routes={[
            ["GET", "battery", "Get my current battery level", "Level%"],
            ["GET", "battery/history", "Get the list of the battery things", "{ [timestamp: string]: { level: number, status: 'unknown' | 'charging' | 'discharging' | 'empty' | 'full' }"]
        ]} />
    </>
}