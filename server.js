// import RxDB from 'rxdb'
const RxDB = require('rxdb')
// add the server-plugin
// import RxDBServerPlugin from 'rxdb/plugins/server'
const RxDBServerPlugin = require('rxdb/plugins/server')
RxDB.plugin(RxDBServerPlugin)

// add the memory-adapter
// import * as MemoryAdapter from 'pouchdb-adapter-memory'
const MemoryAdapter = require('pouchdb-adapter-memory')
RxDB.plugin(MemoryAdapter)

// create database
async function f() {
  const db = await RxDB.create({
    name: 'mydb',
    adapter: 'memory'
  })

  // create collection
  const mySchema = {
    version: 0,
    type: 'object',
    properties: {
      key: {
        type: 'string',
        primary: true
      },
      value: {
        type: 'string'
      }
    }
  }
  await db.collection({
    name: 'items',
    schema: mySchema
  })

  // insert one document
  await db.items.insert({
    key: 'foo',
    value: 'bar'
  })

  const serverState = db.server({
    path: '/db', // (optional)
    port: 3000, // (optional)
    cors: true // (optional), enable CORS-headers
  })
}
f()
