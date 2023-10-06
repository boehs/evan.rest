export async function getHeartbeat(env: Bindings) {
  return (await env.RESTFUL.get<Heartbeat[]>('heartbeat',"json"))![0]
}

export async function getMobleet(env: Bindings) {
  return (await env.RESTFUL.get<Mobleet[]>('mobleet',"json"))
}
