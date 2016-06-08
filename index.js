var caco = require('caco')

module.exports = function (genFn) {
  var asyncFn = caco.wrap(genFn)
  if (genFn.length === 4) {
    // 4 args, return express error handling middleware
    return function middleware (err, req, res, next) {
      return asyncFn.call(this, err, req, res, function (err) {
        if (err) return next(err)
        if (arguments.length === 0) return next()
      })
    };
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
