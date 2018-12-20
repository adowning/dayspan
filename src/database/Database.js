import 'babel-polyfill'
import * as RxDB from 'rxdb'
RxDB.plugin(require('pouchdb-adapter-idb'))
RxDB.plugin(require('pouchdb-adapter-http')) //enable syncing over http
const collections = [
  {
    name: 'heroes',
    schema: require('./HeroSchema.js').default,
    methods: {
      hpPercent() {
        return (this.hp / this.maxHP) * 100
      }
    },
    sync: true
  },
  {
    name: 'timesheets',
    schema: require('./TimesheetSchema.js').default,
    methods: {},
    sync: true
  },
  {
    name: 'profiles',
    schema: require('./ProfileSchema.js').default,
    methods: {},
    sync: true
  },
  {
    name: 'employees',
    schema: require('./EmployeeSchema.js').default,
    methods: {},
    sync: true
  }
]

// const syncURL = 'http://' + window.location.hostname + ':10101/'
// const syncURL = 'https://couch.ashdevtools.com/'
const syncURL = 'http://localhost:5984/'
// const syncURL = 'http://localhost:3000/db/'
console.log('host: ' + syncURL)
// const syncURL = host;

/* because vue-dev-server only reloads the changed code and not the whole page,
 * we have to ensure that the same database only exists once
 * we can either set ignoreDuplicate to true
 * or remove the previous instance which we do here
 */
window.dbs = window.dbs || []
const clearPrev = async function() {
  await Promise.all(window.dbs.map(db => db.destroy()))
}

let dbPromise = null

const _create = async function() {
  console.log('DatabaseService: creating database..')
  await clearPrev()
  const db = await RxDB.create({
    name: 'heroesreactdb',
    adapter: 'idb',
    queryChangeDetection: true,
    password: 'myLongAndStupidPassword'
  })
  window.dbs.push(db)
  console.log('DatabaseService: created database')
  window['rxdb'] = db // write to window for debugging

  // show leadership in title
  db.waitForLeadership().then(() => {
    console.log('isLeader now')
    document.title = '♛ ' + document.title
  })

  // create collections
  console.log('DatabaseService: create collections')
  await Promise.all(collections.map(colData => db.collection(colData)))

  // hooks
  console.log('DatabaseService: add hooks')
  db.collections.heroes.preInsert(function(docObj) {
    const color = docObj.color
    return db.collections.heroes
      .findOne({
        color
      })
      .exec()
      .then(has => {
        if (has !== null) {
          alert('another hero already has the color ' + color)
          throw new Error('color already there')
        }
        return db
      })
  })

  // sync
  console.log('DatabaseService: sync')
  db.heroes.sync({
    remote: syncURL + 'heroes/'
  })
  db.timesheets.sync({
    remote: syncURL + 'timesheets/'
  })
  db.profiles.sync({
    remote: syncURL + 'profiles/'
  })
  db.employees.sync({
    remote: syncURL + 'employees/'
  })
  return db
}

let DB = null
export async function init() {
  console.log('starting')
  if (!dbPromise) dbPromise = _create()
  DB = await dbPromise
  console.log(DB)
  return DB
}

export function get() {
  if (!DB) throw new Error('Database.init() not done yet')
  return DB
}
