const Store = require('./Store')
const Action = require('./Action')
const State = require('./State')
//===================

const state = State.createInstance({
  schema: 'Sencha',
  users: [
    { name: 'John', age: 20 },
    { name: 'Jack', age: 40 },
    { name: 'Benjamin', age: 30 },
    { name: 'Paul', age: 24 },
  ],
  auth: {
    username: 'borvelt',
    email: 'borvelt@gmail.com',
    phones: [9131221, 123213, 23123123],
    address: { home: 'block 12', office: 'st 12, block 22' },
  },
})

console.log(state.users)

//===================
exports.Store = Store
exports.State = State
exports.Action = Action
