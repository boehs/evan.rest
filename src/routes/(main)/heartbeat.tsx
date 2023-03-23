import Schema from "~/components/schema"

export default function Heartbeat() {
  return <>
    <main>
      <p>Ok, so when you go to some random website with spooky trackers, your browser's heart begins to beat.</p>
      <p>At intervals, it periodically sends statistics back to the server.</p>
      <p>I'm doing this, but I'm tracking myself and ya'll can see it.</p>
      <br/>
      <p>Various other routes are built upon this, including /battery, /np, and /asleep</p>
    </main>
    <Schema routes={[
      ['GET', 'heartbeat', "Get my last heartbeat", <pre>{JSON.stringify({
        beat: 1679549965,
        data: {
          sessionLength: 63,
          device: {
            open: "Vivaldi",
            battery: 63
          },
          music: {
            artist: "Declan McKenna",
            track: "Brazil",
            url: "https://www.last.fm/music/Declan+McKenna/_/Brazil"
          }
        }
      }, null, 2)}</pre>],
      ['POST', 'heartbeat', {
        description: "Update the heartbeat",
        protected: true
      }, '200']
    ]}
    />
  </>
}