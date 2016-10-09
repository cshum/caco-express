var raco = require('raco')
function isFn (fn) {
  return typeof fn === 'function'
}
function isRaco (obj) {
  return isFn(obj) && isFn(obj.wrap) && isFn(obj.wrapAll)
}

/**
 * Express middleware wrapper using raco generator function
 *
 * @param {...function*} genFn - generator function
 * @returns {function} express middleware function
 */
module.exports = (function factory (raco) {
  return function (genFn, opts) {
    if (isRaco(genFn)) return factory(genFn)
    /*
     * - catch async error, callback to express next(err)
     * - args.length 0 for explicitly calling next(),
     *   which should pass to next express middleware
     */
    var asyncFn = raco.wrap(genFn, opts)
    if (genFn.length === 4) {
      // 4 args, return express error handling middleware
      return function (err, req, res, next) {
        return asyncFn.call(this, err, req, res, function (err) {
          if (err) return next(err)
          if (arguments.length === 0) return next()
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
  }
})(raco)
