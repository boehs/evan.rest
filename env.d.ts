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
    } | null
  }
}