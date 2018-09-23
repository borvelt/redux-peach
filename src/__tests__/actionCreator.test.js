const ActionCreator = require('../ActionCreator')
const store = require('../../index')
const TEST = 'T E S T'
const TEST2 = 'T E S T 2'
const { _STARTED, _FAILED, _SUCCEED, _ENDED } = require('../Constants')

store.configure()
let actionCreator
describe('Check ActionCreator with no async', () => {
  let action
  it('should get store object', () => {
    expect(() => new ActionCreator({})).toThrow()
  })
  beforeAll(() => {
    actionCreator = new ActionCreator(store)
  })
  it('should be defined', () => {
    expect(() => actionCreator.create()).toThrow()
  })
  it('should have name property', () => {
    expect(() => actionCreator.create({})).toThrow()
  })
  beforeAll(() => {
    action = actionCreator.create({ name: TEST })
  })
  it('should name and TYPE be same', () => {
    expect(action.TYPE).toEqual(TEST)
  })
  it('should check some listeners name', () => {
    expect(action.FAILED).toEqual(`${TEST + _FAILED}`)
    expect(action.SUCCEED).toEqual(`${TEST + _SUCCEED}`)
  })
})

describe('Check ActionCreator with async', () => {
  let asyncAction
  beforeAll(() => {
    asyncAction = actionCreator.create({ name: TEST2, async: true })
  })
  it('should check some listeners name', () => {
    expect(asyncAction.STARTED).toEqual(`${TEST2 + _STARTED}`)
    expect(asyncAction.FAILED).toEqual(`${TEST2 + _FAILED}`)
    expect(asyncAction.SUCCEED).toEqual(`${TEST2 + _SUCCEED}`)
    expect(asyncAction.ENDED).toEqual(`${TEST2 + _ENDED}`)
  })
})

describe('Check definition', () => {
  beforeAll(() => {
    actionCreator.create({ name: TEST })
  })
  it('should be define in store Actions', () => {
    expect(store.toReduxStoreObject().Actions.get(TEST).TYPE).toEqual(TEST)
  })
})
