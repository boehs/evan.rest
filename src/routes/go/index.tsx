import { Match, Show, Switch } from "solid-js";
import { createServerAction$ } from "solid-start/server"

// see: https://raw.githubusercontent.com/zws-im/tools/main/generate-env.js
const allowed = [
  '\u200C',
  '\u200D',
  '\uDB40\uDC61',
  '\uDB40\uDC62',
  '\uDB40\uDC63',
  '\uDB40\uDC64',
  '\uDB40\uDC65',
  '\uDB40\uDC66',
  '\uDB40\uDC67',
  '\uDB40\uDC68',
  '\uDB40\uDC69',
  '\uDB40\uDC6A',
  '\uDB40\uDC6B',
  '\uDB40\uDC6C',
  '\uDB40\uDC6D',
  '\uDB40\uDC6E',
  '\uDB40\uDC6F',
  '\uDB40\uDC70',
  '\uDB40\uDC71',
  '\uDB40\uDC72',
  '\uDB40\uDC73',
  '\uDB40\uDC74',
  '\uDB40\uDC75',
  '\uDB40\uDC76',
  '\uDB40\uDC77',
  '\uDB40\uDC78',
  '\uDB40\uDC79',
  '\uDB40\uDC7A',
  '\uDB40\uDC7F',
] as const

function genId() {
  let shortId = '';

  for (let i = 0; i < 5; i++) {
    shortId += allowed[Math.floor(Math.random() * allowed.length)];
  }

  return shortId
}

function getCook(cookiename: string, request: Request) {
  if (!request.headers.get('cookie')) throw new Error('no cookie')
  let cookiestring = RegExp(cookiename + "=[^;]+").exec(request.headers.get('cookie')!);
  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}

export default function Bunny() {
  const [stats, { Form: StatsForm }] = createServerAction$(async (data: FormData, { env, request }) => {
    const urls = ((await env.RESTFUL.get('go', 'json')) as {
      [url: string]: Go
    } | null)
    if (!urls) return 'database corrupted'
    const match = Object.entries(urls).find(([k]) => k == (data.get('url') as string).replace('https://evan.rest/go/',''))
    if (!match) return 'no matching url'
    return match[1]
  })

  const [create, { Form: CreateForm }] = createServerAction$(async (data: FormData, { env, request }) => {
    const pw = getCook('pw', request)
    if (pw == env.PW!) {
      let urls: {
        [url: string]: Go
      } = await env.RESTFUL.get('go', 'json') || {}
      const generated = genId()
      console.log(generated)
      if (urls) {
        const mightExist = Object.entries(urls).find(([_, v]) => v.to == data.get('url'))
        if (mightExist) return 'https://evan.rest/go/' + mightExist[0]
        const dupId = Object.entries(urls).find(([k]) => k == generated)
        if (dupId) return 'you got unlucky! 🎲'
      }
      urls[generated] = {
        created: Date.now(),
        to: data.get('url') as string,
        clicks: []
      }
      await env.RESTFUL.put('go', JSON.stringify(urls))
      return 'https://evan.rest/go/' + generated
    } else return 'bad res'
  })

  return <>
    <main>
      <sup>I don't understand it myself. 🪄🐇</sup>
      <h2 class="small">Create a go link 🔒</h2>
      <CreateForm>
        <input type="text" placeholder="To" name="url" />
        <input type="submit" value="Create" />
      </CreateForm>
      <Switch>
        <Match when={create.pending}>
          Loading...
        </Match>
        <Match when={create.result}>
          {create.result}
          <button onclick={() => navigator.clipboard.writeText(create.result!)}>copy</button>
        </Match>
      </Switch>
      <h2 class="small">Get statistics for a go link</h2>
      <StatsForm>
        <input type="text" name="url" placeholder="https://evan.rest/go" />
        <input type="submit" value="Check" />
      </StatsForm>
      <Switch>
        <Match when={stats.pending}>
          Loading...
        </Match>
        <Match when={typeof stats.result == 'string'}>
          {stats.result as string}
        </Match>
        <Match when={typeof stats.result == 'object'}>
          <ul>
            <li><b>To: </b> <a href={(stats.result as Go).to}>{(stats.result as Go).to}</a></li>
            <li><b>Created: </b> {(stats.result as Go).created}</li>
          </ul>
        </Match>
      </Switch>
    </main>
  </>
}