# raco-express

Express middleware wrapper for [raco](https://github.com/cshum/raco) generator function.

[![Build Status](https://travis-ci.org/cshum/raco-express.svg?branch=master)](https://travis-ci.org/cshum/raco-express)

```bash
npm install raco raco-express
```

This is a [raco](https://github.com/cshum/raco) version of [co-express](https://github.com/mciparelli/co-express), 
which supports 'yielding' callback functions using `next(err, val)`.

Calling `next()` without argument, passes control to the next middleware stack.

### `app = wrap(express())`
### `router = wrap(express.Router())`
### `mw = wrap(mw*)`

```js
var express = require('express')
var wrap = require('raco-express')
var fs = require('fs')

// wrap express application
var app = wrap(express())

app.get('/foo', function * (req, res, next) {
  // yield callback function using raco next(err, val)
  req.data = yield fs.readFile('./data.json', 'utf8', next)
  yield setTimeout(next, 10)

  next() // calling next() passes to next middleware
}, function (req, res) {
  res.send(req.data)
})

app.route('/bar').get(function * (req, res, next) {
  req.send(yield fs.readFile('./bar.json', 'utf8', next))
})


// wrap express router
var errRouter = wrap(express.Router())
// 4 arguments for error handling middleware
errRouter.use(function * (err, req, res, next) {
  res.status(500).send({ 
    success: false, 
    message: err.message 
  })
})
app.use(errRouter)


// wrap express middleware
var mw = wrap(function * (req, res, next) {
  // yield callback function using raco next(err, val)
  req.data = yield fs.readFile('./data.json', 'utf8', next)
  yield setTimeout(next, 10)

  next() // calling next() passes to next middleware
})
...

```

## License

MIT
