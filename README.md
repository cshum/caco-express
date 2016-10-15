# raco-express

Express middleware wrapper for [raco](https://github.com/cshum/raco) generator function.

[![Build Status](https://travis-ci.org/cshum/raco-express.svg?branch=master)](https://travis-ci.org/cshum/raco-express)

```bash
npm install raco raco-express
```

This is a [raco](https://github.com/cshum/raco) version of [co-express](https://github.com/mciparelli/co-express), 
which supports 'yielding' callback functions using `next(err, val)`.

Calling `next()` without argument, passes control to the next middleware stack.


```js
var express = require('express')
var raco = require('raco')
var wrap = require('raco-express')(raco)
var fs = require('fs')

var app = express()

app.get('/foo', wrap(function * (req, res, next) {
  // yield callback function using raco next(err, val)
  req.data = yield fs.readFile('./data.json', 'utf8', next)
  yield setTimeout(next, 10)

  next() // calling next() passes to next middleware
}), function (req, res) {
  res.send(req.data)
})

// 4 arguments for error handling middleware
app.use(wrap(function * (err, req, res, next) {
  res.status(500).send({ 
    success: false, 
    message: err.message 
  })
}))
```

## License

MIT
