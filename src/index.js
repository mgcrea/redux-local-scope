import {isObject, isFunction, startsWith, mapObject} from './util';

export const scopeType = (scope, type) => `${scope}/${type}`;

export const scopeTypes = (scope, types = {}) => mapObject(types, scopeType.bind(null, scope));

export const scopeAction = (scope, action) => (...args) => {
  const resolvedAction = action(...args);
  if (isObject(resolvedAction) && resolvedAction.type) {
    resolvedAction.type = scopeType(scope, resolvedAction.type);
    return resolvedAction;
  } else if (isFunction(resolvedAction)) {
    return (dispatch, getState, extraArgument) => resolvedAction((actionObj) => {
      dispatch({...actionObj, type: scopeType(scope, actionObj.type)});
    }, getState, extraArgument);
  }
  return resolvedAction;
};

export const scopeActions = (scope, actions = {}) => mapObject(actions, scopeAction.bind(null, scope));

export const scopeReducers = (scope, reducers) => {
  const namespace = `${scope}/`;
  const initialState = reducers(undefined, {type: null});
  return (state = initialState, action) => {
    // Only process relevant action types
    if (!startsWith(action.type, namespace)) {
      return state;
    }
    return reducers(state, {...action, type: action.type.substr(namespace.length)});
  };
};

export const scopeModule = (scope, {actions, reducers, ...others}) => (
  {actions: scopeActions(scope, actions), reducers: scopeReducers(scope, reducers), ...others}
);

export default scopeModule;
