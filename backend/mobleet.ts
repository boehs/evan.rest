import { Hono } from "hono"
import { getMobleet } from "../lib/heartbeat"

const app = new Hono<{
    Bindings: {
        RESTFUL: KVNamespace,
        PW: string
    },
}>({ strict: false })

app.get('/mobleet', async c => {
    return c.jsonT(await getMobleet(c.env))
})

const day = 86400000 as const

type MobleetRequest = {
    Water: string[]
    Steps: string[]
    Things: number
}

function parseHealth(imp: string[]): [number, number, string][] {
    return imp.map(sample => {
        const splited = sample.split(':')
        return [Number(splited[0]), Number(splited[1]), splited[2]]
    })
}

function toCumulative(imp: [number, number, string][]): [number, number, string][] {
    let sum = 0;
    return imp.map(sample => {
        return [Number(sample[0]), sum += Number(sample[1]), sample[2]]
    })
}

function filterSteps(imp: [number, number, string][]): [number, number, string][] {
    const currentDate = new Date(); // Get the current date

    return imp.filter((sample) => {
        const entryDate = new Date(sample[0] * 1000);
        const isToday = entryDate.getDate() === currentDate.getDate();
        const isGarmin = sample[2] === 'Connect';

        return isToday ? !isGarmin : isGarmin;
    });
}



app.post('/mobleet', async c => {
    const res: MobleetRequest = await c.req.json()
    if (c.req.headers.get('Authorization') == c.env.PW) {
        const allThings = await c.env.RESTFUL.get<Mobleet>('mobleet', 'json')
        const filtered = (allThings!.things || []).filter(beat => Date.now() < beat[0] + day)

        await c.env.RESTFUL.put('mobleet', JSON.stringify({
            water: res.Water ? toCumulative(parseHealth(res.Water)) : [],
            steps: toCumulative(filterSteps(parseHealth(res.Steps))),
            things: [...filtered, [Date.now(), res.Things]]
        }))

        return c.newResponse(null, 200)
    }
    return c.newResponse(null, 400)
})

export const mobleet = app
