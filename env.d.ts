interface Bindings {
	RESTFUL: KVNamespace;
}

interface Variables {
  PW: string
}

type Envs = {
  Bindings: Bindings;
  Variables: Variables;
};

type Heartbeat = {
  beat: number,
  data: {
    sessionLength: number,
    device: {
      open: string,
      battery: {
        level: number,
        status: 'unknown' | 'charging' | 'discharging' | 'empty' | 'full'
      }
    },
    music: {
      artist: string,
      track: string,
      url: string,
      image: string
    } | null,
    weather: {
      icon: string | null,
      desc: string,
      speed: number,
      temp: number
    },
    activity: {
      steps: number | null,
      floors: number | null
    }
  }
}

type Go = {
  created: number,
  to: string,
  clicks: number[]
}
