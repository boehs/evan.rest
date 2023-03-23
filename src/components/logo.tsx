import { createSignal, onCleanup, onMount } from "solid-js"


export default function Logo() {
  const [tick,setTick] = createSignal(0)
  
  let int: NodeJS.Timer
  
  onMount(() => {
    int = setInterval(() => {
      setTick(tick => tick == 12 ? 0 : tick+1)
    },500)
  })
  
  onCleanup(() => clearTimeout(int))
  
  const z = (i: number) => {
    if (tick() > 8) {
      if (tick() - 9 >= i) return 'z'
      else return ' '
    }
    // 
    else if (tick() > 4) {
      if (tick() - 5 >= i) return ' '
    }
    // 
    else if (tick() == i) return 'Z'
    return 'z'
  }
  
  return <pre>
{`    +       *      .         ${z(1)}    ${z(3)}    _
        .      *           ${z(0)}   ${z(2)}      | |
  _____   ____ _ _ __    _ __ ___  ___| |_
 / _ \\ \\ / / _\` | '_ \\  | '__/ _ \\/ __| __|
|  __/\\ V / (_| | | | |_| | |  __/\\__ \\ |_
 \\___| \\_/ \\__,_|_| |_(_)_|  \\___||___/\\__|
`}
  </pre>
}
