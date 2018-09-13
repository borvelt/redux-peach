const reduxActions = require('redux-actions')
const Store = require('./Store')
const ActionSelector = require('./ActionSelector')

const _ActionCreator = (
  TYPE,
  onDispatch = (...args) => {
    args.pop()
    args.pop()
    return args[0]
  },
  options = {
    async: false,
    payloadCreator: undefined,
    metaCreator: undefined,
  },
) => {
  const TYPE_STARTED = TYPE + '_STARTED'
  const TYPE_FAILED = TYPE + '_FAILED'
  const TYPE_SUCCEED = TYPE + '_SUCCEED'
  const TYPE_ENDED = TYPE + '_ENDED'

  const actionCreators = {
    [TYPE_STARTED]: reduxActions.createAction(
      TYPE_STARTED,
      options.payloadCreator,
      options.metaCreator,
    ),
    [TYPE_FAILED]: reduxActions.createAction(
      TYPE_FAILED,
      options.payloadCreator,
      options.metaCreator,
    ),
    [TYPE_SUCCEED]: reduxActions.createAction(
      TYPE_SUCCEED,
      options.payloadCreator,
      options.metaCreator,
    ),
    [TYPE_ENDED]: reduxActions.createAction(
      TYPE_ENDED,
      options.payloadCreator,
      options.metaCreator,
    ),
  }

  const payload = {
    TYPE,
    STARTED: TYPE_STARTED,
    FAILED: TYPE_FAILED,
    SUCCEED: TYPE_SUCCEED,
    ENDED: TYPE_ENDED,
  }

  function createAsync(...args) {
    return async (dispatch, getState) => {
      let result
      const startedAt = new Date().getTime()
      dispatch(
        actionCreators[TYPE_STARTED]({
          startedAt,
          ...args,
        }),
      )
      try {
        result = await onDispatch(...args, dispatch, getState)
        dispatch(actionCreators[TYPE_SUCCEED](result))
      } catch (error) {
        dispatch(
          actionCreators[TYPE_FAILED]({
            errorMessage: error.message,
          }),
        )
        throw error
      }
      let endedAt = new Date().getTime()
      dispatch(
        actionCreators[TYPE_ENDED]({
          endedAt: endedAt,
          elapsed: endedAt - startedAt,
        }),
      )
      return result
    }
  }

  function create(...args) {
    return (dispatch, getState) => {
      let result
      try {
        result = onDispatch(...args, dispatch, getState)
        dispatch(actionCreators[TYPE_SUCCEED](result))
      } catch (error) {
        dispatch(
          actionCreators[TYPE_FAILED]({
            errorMessage: error.message,
          }),
        )
        throw error
      }
      return result
    }
  }
  if (options.async) {
    Object.assign(createAsync, payload)
    Store.Actions[TYPE] = createAsync
    return createAsync
  }
  Object.assign(create, payload)
  Store.Actions[TYPE] = create
  return create
}

const ActionCreator = props => {
  try {
    ActionSelector(props.name)
  } catch (e) {
    _ActionCreator(props.name, props.onDispatch, {
      async: props.async,
      payloadCreator: props.payloadCreator,
      metaCreator: props.metaCreator,
    })
  }
}

module.exports = ActionCreator
