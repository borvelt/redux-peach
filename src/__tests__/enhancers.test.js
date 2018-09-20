const enchancer = require('../Enhancers')

test('Enchancer should be a function', () => {
  expect(typeof enchancer).toBe(typeof (() => {}))
})
