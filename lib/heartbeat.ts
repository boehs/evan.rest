export async function getHeartbeat(env: Bindings) {
  return env.RESTFUL.get<Heartbeat>('heartbeat',"json")
}