import { For } from "solid-js"

export default function Checklist(props: {
  list: [boolean, string][]
}) {
  return <ul>
    <For each={props.list}>
      {([done, text]) => <li>{done ? '✅' : '❌'} {text}</li>}
    </For>
  </ul>
}