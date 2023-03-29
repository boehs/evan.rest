import { APIEvent, redirect } from "solid-start";

async function handler ({ request: req, env, params }: APIEvent) {
  let urls: {
    [url: string]: Go
  } = await env.RESTFUL.get('go', 'json') || {}
  if (!urls) return 'database corrupted'
  const match = Object.entries(urls).find(([k]) => k == decodeURI(params.to))
  if (!match) return new Response(':/', {status: 404})
  return Response.redirect(match[1].to)
}

export const GET = handler