var caco = require('caco')

/**
 * caco generator function wrapper for express middleware
 *
 * @param {function*} genFn - generator function
 * @returns {function} express middleware function
 */
module.exports = function (genFn) {
  var asyncFn = caco.wrap(genFn)
  /*
   * - catch async error, callback to express next(err)
   * - args.length 0 for explicitly calling next(),
   *   which should pass to next express middleware
   */
  if (genFn.length === 4) {
    // 4 args, return express error handling middleware
    return function middleware (err, req, res, next) {
      return asyncFn.call(this, err, req, res, function (err) {
        if (err) return next(err)
        if (arguments.length === 0) return next()
      })
    }
  } else {
    // return normal express middleware
    return function middleware (req, res, next) {
      return asyncFn.call(this, req, res, function (err) {
        if (err) return next(err)
        if (arguments.length === 0) return next()
      })
    }
  }
}
