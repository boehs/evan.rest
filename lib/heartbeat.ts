export async function getHeartbeat(env: Bindings) {
  return (await env.RESTFUL.get<Heartbeat[]>('heartbeat',"json"))![0]
}