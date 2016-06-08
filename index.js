var caco = require('caco')

/**
 * caco generator function wrapper for express middleware
 *
 * @param {...function*} genFn - generator function
 * @returns {function} express middleware function
 */
module.exports = function mw (genFn) {
  // return array if over 1 args of genFn
  var args = Array.prototype.slice.call(arguments)
  if (args.length > 1) {
    return args.map(function (genFn) {
      return mw(genFn)
    })
  }

  /*
   * - catch async error, callback to express next(err)
   * - args.length 0 for explicitly calling next(),
   *   which should pass to next express middleware
   */
  var asyncFn = caco.wrap(genFn)
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
