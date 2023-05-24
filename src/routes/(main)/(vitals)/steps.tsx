export default function Steps() {
    return <>
        <main>
            <p>How many steps have I taken today?</p>
            <p><b>8,102</b> is how many!</p>
            <p>
                Actually, that was a lie! This statistic is <i>made up</i>.
                I do have a flashy step counter, but it has no proper API and
                given the price I paid for it, I'm skirmish reversing the app.
            </p>
            <p>
                Actually, that's also a lie. I <i>have</i> already found the endpoints,
                just automated requests are a lil sketch.
            </p>
            <p>
                Instead, this statistic chooses a random, normally distributed amount of steps
                that I took during the time between heartbeats, if greater than 5 minutes
                (T<sub>2</sub> - T<sub>1</sub> - (1000 * 60 * 5)).
                Of course, greater amounts away mean larger amounts of steps.
            </p>
            <p>
                This model still needs fine tuning (comparing V<sub>a</sub> to V<sub>e</sub>).
                I suppose this could lead to some interesting data.
            </p>
            <p>
                Speaking of, all this is reminding me of karlicoss' <a href="https://github.com/karlicoss/HPI">HPI</a>.
                I suppose, in a way, this site is my own little HPI.
                Isn't that fun? I'd like to continue playing with HPIs in the future.
            </p>
        </main>
    </>
}
