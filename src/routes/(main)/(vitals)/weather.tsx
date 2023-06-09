import { run } from "../../../../backend/weather";
import { useRouteData } from "solid-start";
import Schema from "~/components/schema";
import { hb } from "~/routes/(main)";

export default function Weather() {
    const { heartbeat } = useRouteData<hb>()
    const processed = () => {
        if (!heartbeat()) return
        let p = run(heartbeat()!)
        //p.word = p.word!.charAt(0).toUpperCase() + p.word!.slice(1);
        p.desc = p.desc?.toLocaleLowerCase()
        return p
    }
    return <>
        <main>
            <sup>The IrrelEVANt Weather Network</sup>
            <p>Wouldn't it be fun if you took the weather channel
                but instead of "Partly Cloudy" you get antiquated words
                from a 500 year old dictionary?
            </p>
            <sup>- Sun Tzu, The Art of War</sup>
            <hr/>
            <p>Outside it is <b>{processed()?.word}</b></p>
            <p>
                This is a good assessment,
                given that it is <b>{processed()?.temp}</b>°C and <b>{processed()?.desc}</b> right where I am.
            </p>
            <hr/>
            <p>
                What other descriptions are there? <a href="https://github.com/weather-gov/api/discussions/547#discussioncomment-2555191">Who knows?</a>
            </p>
        </main>
        <Schema routes={[
            ["GET","weather", "To get the weather", '{ word: string, temp: number (°C), desc: string }'],
        ]}/>
    </>
}
