const Store = require('./Store')
const Action = require('./Action')
const State = require('./State')

let a = State({ a: 20 })
console.log(a.a)

exports.Store = Store
exports.State = State
exports.Action = Action
