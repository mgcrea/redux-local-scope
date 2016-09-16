
const mapObjectToScope = (object, func) =>
  Object.keys(object).reduce((soFar, key) => {
    soFar[key] = func(object[key]); // eslint-disable-line no-param-reassign
    return soFar;
  }, {});

export const scopeType = (scope, type) => `${scope}/${type}`;
export const scopeTypes = (scope, types = {}) => mapObjectToScope(types, scopeType.bind(null, scope))

export const scopeAction = (scope, action) => (...args) => {
  const actionObj = action(...args);
  actionObj.type = scopeType(scope, actionObj.type);
  return actionObj;
};
export const scopeActions = (scope, actions = {}) => mapObjectToScope(actions, scopeAction.bind(null, scope))

export const scopeReducers = (scope, reducers) => {
  const namespace = `${scope}/`;
  const initialState = reducers(undefined, {type: null});
  return (state = initialState, action) => {
    // Only process relevant action types
    if (!String(action.type).startsWith(namespace)) {
      return state;
    }
    return reducers(state, {...action, type: action.type.substr(namespace.length)});
  };
};

export const scopeModule = (scope, {actions, reducers, ...others}) => (
  {actions: scopeActions(scope, actions), reducers: scopeReducers(scope, reducers), ...others}
);

export default scopeModule;
