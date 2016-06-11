# caco-express

Express middleware wrapper for [caco](https://github.com/cshum/caco) generator function.

[![Build Status](https://travis-ci.org/cshum/caco-express.svg?branch=master)](https://travis-ci.org/cshum/caco-express)

```bash
npm install caco-express
```

This is a [caco](https://github.com/cshum/caco) version of [co-express](https://github.com/mciparelli/co-express), 
which supports 'yielding' callback functions using `next(err, val)`.

Calling `next()` without argument, passes control to the next middleware stack.


```js
var express = require('express')
var wrap = require('caco-express')
var fs = require('fs')

var app = express()

app.get('/foo', wrap(function * (req, res, next) {
  // yield callback function using caco next(err, val)
  req.data = yield fs.readFile('./data.json', 'utf8', next)
  yield setTimeout(next, 10)

  next() // calling next() passes to next middleware
}, function * (req, res) {
  res.send(req.data)
}))

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
