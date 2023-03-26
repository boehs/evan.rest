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
      battery: number | null
    },
    music: {
      artist: string,
      track: string,
      url: string,
      image: string
    } | null
  }
}