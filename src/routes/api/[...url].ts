import { APIEvent } from "solid-start"
import api from '../../../backend/index'
import { Hono } from 'hono'

const configuredHono = new Hono().route('/api',api)
async function handler({ request: req, env }: APIEvent) {
    return await configuredHono.fetch(req,env)
}

export const GET = handler
export const POST = handler
export const PATCH = handler
export const PUT = handler
export const DELETE = handler