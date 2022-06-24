import superTest from 'supertest'
import Server from '../../src/server.js'
import Database from '../../src/database.js'
import {expect, test, describe, afterEach} from '@jest/globals'

describe('API E2E Teste Suite', () => {
  afterEach(() => {
    Database.clear()
  })

  test('POST/ Should save an item and return ok', async () => {
    const response = await superTest(Server)
      .post('/')
      .send({
        nome: 'Cristan',
        age: 20
      })
    const expectedResponse = {ok: 1}

    expect(JSON.parse(response.text)).toStrictEqual(expectedResponse)
  })
  
  test('GET/ Should return an array', async () => {
    const response = await superTest(Server).get('/')
    const data = JSON.parse(response.text)

    expect(data.keys.length).toEqual(0)
    expect(data.values.length).toEqual(0)
    expect(data.keys).toBeInstanceOf(Array)
    expect(data.values).toBeInstanceOf(Array)
  })

  test('DELETE/ Should delete item and return new list', async () => {
    await superTest(Server)
      .post('/')
      .send({
        nome: 'Cristan',
        age: 20
      })
    await superTest(Server)
      .post('/')
      .send({
        nome: 'ErickWendel',
        age: 60
      })

    const responseGet = await superTest(Server).get('/')
    const dataGet = JSON.parse(responseGet.text)

    const responseDelete = await superTest(Server)
      .delete('/')
      .query({key: dataGet.keys[1]})
    const data = JSON.parse(responseDelete.text)

    expect(data.values.length).toEqual(1)
    expect(data.values).toStrictEqual([{ nome: 'Cristan', age: 20}])
  })
});