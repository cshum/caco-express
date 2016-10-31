var raco = require('raco')
var methods = require('methods')
var flatten = require('array-flatten')

function isFunction (val) {
  return val && typeof val === 'function'
}

function isGenerator (val) {
  return val && isFunction(val.next) && isFunction(val.throw)
}

function isGeneratorFunction (val) {
  if (!val || !val.constructor) return false
  if (val.constructor.name === 'GeneratorFunction' || val.constructor.displayName === 'GeneratorFunction') return true
  return isGenerator(val.constructor.prototype)
}

function isExpress (val) {
  return val && isFunction(val.all) && isFunction(val.post) && isFunction(val.get)
}

function wrapMethod (fn, opts) {
  return function () {
    var args = flatten(Array.prototype.slice.call(arguments)).map(function (fn) {
      return wrap(fn, opts)
    })
    return wrap(fn.apply(this, args), opts)
  }
}

function wrap (app, opts) {
  if (isGeneratorFunction(app)) {
    // app is middleware generator function
    var asyncFn = raco.wrap(app, opts)
    if (app.length === 4) {
      // 4 args, return express error handling middleware
      return function (err, req, res, next) {
        return asyncFn.call(this, err, req, res, function (err) {
          if (err) return next(err)
          if (arguments.length === 0) return next()
          // args.length 0 for explicitly calling middleware next()
        })
      }
    } else {
      // return normal express middleware
      return function (req, res, next) {
        return asyncFn.call(this, req, res, function (err) {
          if (err) return next(err)
          if (arguments.length === 0) return next()
        })
      }
    }
  } else if (isExpress(app) && !app._racoWrapped) {
    app._racoWrapped = true
    // app is express object
    methods.forEach(function (method) {
      if (isFunction(app[method])) app[method] = wrapMethod(app[method], opts)
    })
    ;['route', 'use', 'all', 'del'].forEach(function (method) {
      if (isFunction(app[method])) app[method] = wrapMethod(app[method], opts)
    })
  }
  return app
}

module.exports = wrap
