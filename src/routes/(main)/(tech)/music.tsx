import { For } from "solid-js"
import { useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import Schema from "~/components/schema"

export function routeData() {
    return {
        music: createServerData$(async (_, { env }) => {
            const beats = await (env as Bindings).RESTFUL.get<Heartbeat[]>('heartbeat', "json")
            const ranges = beats?.filter(beat => beat.data.music).map(beat => beat.data.music!)
            return ranges
        })
    }
}

function sbfard(array: (string | number)[]) {
    let frequency: Record<string | number, number> = {}, value;
    for (let i = 0; i < array.length; i++) {
        value = array[i];
        if (value in frequency) {
            frequency[value]++;
        }
        else {
            frequency[value] = 1;
        }
    }
    return [...new Set(array)].sort((a, b) => frequency[b] - frequency[a]).filter(v => frequency[v] > 1);
}

export default function Music() {
    const { music } = useRouteData<typeof routeData>()
    const artists = () => music() ? sbfard(music()!.map(m => m.artist)!) : []
    return <>
        <main>
            <sup>Fondly known as hack.fm</sup>
            <p>
                This is a (incomplete) list of songs I've listened to in the last 24 hours.
            </p>
            <For each={music()}>
                {(song, i) => <div class="flex" style={{
                    "align-items": "flex-end",
                    "margin-block": "1em"
                }}>
                    <img src={song.image} style={{
                        height: i() == 0 ? '120px' : '75px'
                    }} />
                    <div>
                        <h2 class={`${i() == 0 ? '' : 'small'}`} style={{
                            margin: 0,
                            "margin-bottom": "10px"
                        }}><a href={song.url}>{song.track}</a></h2>
                        <p style={{
                            margin: 0
                        }}>{song.artist}</p>
                    </div>
                </div>}
            </For>
            <p>
                It's possible some songs are missing. It's possible I skipped it.
                The data only reflects the music I was listening to at the time of a heartbeat.
            </p>
        </main>
        <aside class="c2">
            <h2>Top Artists</h2>
            <ol>
                <For each={artists()}>
                    {artist => <li>{artist}</li>}
                </For>
            </ol>
            <Schema routes={[
                ['GET', 'music', "Get the current song I'm listening to", 'See heartbeat'],
                ['GET', 'music/history', "Get my listening history", '{ [timestamp: string]: music }']
            ]} only={false} />
        </aside>
    </>
}