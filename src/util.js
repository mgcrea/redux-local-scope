
export const isObject = maybeObject =>
  typeof maybeObject === 'object';

export const isFunction = maybeFunction =>
  typeof maybeFunction === 'function';

export const startsWith = (string, target) =>
  String(string).slice(0, target.length) === target;

export const mapObject = (object, func) =>
  Object.keys(object).reduce((soFar, key) => {
    soFar[key] = func(object[key]); // eslint-disable-line no-param-reassign
    return soFar;
  }, {});
