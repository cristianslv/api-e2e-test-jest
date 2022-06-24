import { once } from 'events';
import { createServer } from 'http'
import { randomUUID } from 'crypto';
import Database from './database';

function respondJSON(data, response) {
  return response.end(JSON.stringify(data))
}

async function handler(request, response) {
  const {method} = request

  if (method === 'GET') {
    return respondJSON({
      values: [...Database.values()], 
      keys: [...Database.keys()]
    }, response)
  }

  if (method === 'POST') {
    const body = JSON.parse(await once(request, 'data'))
    const id = randomUUID();

    Database.set(id, body)

    return respondJSON({ok: 1}, response)
  }

  if (method === 'DELETE') {
    const urlParams = request.url.split('='); 

    Database.delete(urlParams[1])

    return respondJSON({deleted: true, values: [...Database.values()]}, response)
  }
}

export default createServer(handler)