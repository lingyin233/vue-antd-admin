import enquireJs from 'enquire.js';

export function isDef(v) {
  return v !== undefined && v !== null;
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]';
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true);
    },
    unmatch: function () {
      call && call(false);
    }
  };
  enquireJs.register('only screen and (max-width: 767.99px)', handler);
}

export function clearObject(obj, clearArray) {
  for (var key in obj) {
    if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      clearObject(obj[key], clearArray);
    } else if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
      if (clearArray) {
        obj[key] = [];
      } else {
        clearObject(obj[key], clearArray);
      }
    } else {
      if (typeof obj[key] === 'string') {
        obj[key] = '';
      } else if (typeof obj[key] === 'number') {
        obj[key] = null;
      } else if (typeof obj[key] === 'boolean') {
        obj[key] = null;
      }
    }
  }
}

var class2type = {};

export function extend() {

  var type = function (obj) {
    if (obj == null) {
      return obj + "";
    }
    var t = typeof obj === "object" || typeof obj === "function" ?
      class2type[class2type.toString.call(obj)] || "object" :
      typeof obj;
    console.log('t', t);
    return t;
  };

  var isFunction = function (obj) {
    return type(obj) === 'function';
  };

  var isPlainObject = function (obj) {
    var proto, Ctor;

    if (!obj || class2type.toString.call(obj) !== "[object Object]") {
      return false;
    }

    proto = Object.getPrototypeOf(obj);

    if (!proto) {
      return true;
    }

    Ctor = class2type.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && class2type.hasOwnProperty.toString.call(Ctor) === class2type.hasOwnProperty.toString.call(Object);
  };

  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  if (typeof target === "boolean") {
    deep = target;

    target = arguments[i] || {};
    i++;
  }

  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }

  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {

    if ((options = arguments[i]) != null) {

      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target === copy) {
          continue;
        }

        if (deep && copy && (isPlainObject(copy) ||
          (copyIsArray = Array.isArray(copy)))) {

          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];

          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);

        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}

const _toString = Object.prototype.toString;
