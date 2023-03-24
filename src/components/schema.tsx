import { For, JSX, Show } from "solid-js"
import { A } from "solid-start"
import { Private } from "./warnings"

type method = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE'

export default function Schema(props: {
  routes: [method, string, string | {
    description: string
    params?: {
      [param: string]: string
    },
    protected?: boolean
  }, string | JSX.Element][]
}) {
  return <section class="gray">
    <h2>API</h2>
    <For each={props.routes}>
      {([method, route, options, returns]) => <>
        <h3>{method.toUpperCase()} <a href={'/api/' + route}>{'/api/' + route}</a></h3>
        <Show when={typeof options == 'object'} fallback={<p>{options as string}</p>}>
          <p>{options.description}</p>
          <Show when={options.params}>
            <h4>Params</h4>
            <ul>
              <For each={Object.entries(options.params)}>
                {([k,v]) => <li><b>{k}</b>: {v}</li>}
              </For>
            </ul>
          </Show>
          <Show when={options.protected}>
            <Private/>
          </Show>
        </Show>
        <h4>Returns</h4>
        <p>{returns}</p>
      </>}
    </For>
  </section>
}