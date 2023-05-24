import Schema from "~/components/schema";

export default function Weather() {
    return <>
        <main>
            <sup>The IrrelEVANt Weather Network</sup>
            <p>Wouldn't it be fun if you took the weather channel,
                but instead of "Partly Cloudy" you get antiquated words
                from a 500 year old dictionary?</p>
            <hr/>
            <p>Outside it is <b>Hellish</b></p>
            <p>
                This is a good assessment,
                given that it is <b>30</b>°C, <b>Humid</b>, and <b>Sunny</b>
            </p>
            <hr/>
            <p>
                What other descriptions are there? <a href="https://github.com/weather-gov/api/discussions/547#discussioncomment-2555191">Who knows?</a>
            </p>
        </main>
        <Schema routes={[
            ["GET","weather", "Get the weather where I am", '{ word: string, temp: number (°C), desc: string }'],
        ]}/>
    </>
}
