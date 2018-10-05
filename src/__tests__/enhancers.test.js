const EnhancerComposer = require('../Enhancers')

describe('enhancers and middlewares as EnhancerComposer', () => {
  it('should get middlewares and enhancers as array', () => {
    expect(() => EnhancerComposer({}, 'enhancers')).toThrow()
  })

  it('should return function', () => {
    expect(typeof EnhancerComposer).toBe(typeof (x => x))
  })
})
