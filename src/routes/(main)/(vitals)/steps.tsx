import { RouteDataArgs, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"

export function routeData(e: RouteDataArgs) {
    return {
        activity: createServerData$(async (_, { env }) => {
            let hb = (await (env as Bindings).RESTFUL.get<Mobleet>('mobleet', "json"))!
            if (hb) return hb.steps[hb.steps.length - 1][1]
        })
    }
}

export default function Steps() {
    const { activity } = useRouteData<typeof routeData>()
    return <>
        <main>
            <p>How many steps have I taken today?</p>
            <p><b>{activity()}</b> steps is how many!</p>
            <hr />
        </main>
    </>
}
