const enchancer = require('../Enhancers')
test('enchancer should be a function', () => {
  expect(typeof enchancer).toBe(typeof (() => {}))
})
