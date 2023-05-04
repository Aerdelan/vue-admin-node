# boom-clone [![Build Status](https://travis-ci.org/tableflip/boom-clone.svg?branch=master)](https://travis-ci.org/tableflip/boom-clone) [![dependencies Status](https://david-dm.org/tableflip/boom-clone/status.svg)](https://david-dm.org/tableflip/boom-clone)

Like `Boom.wrap`, but returns a cloned boomified error...because `Boom.wrap` mutates your error object.

## Example

```js
var Boom = require('boom')
var boomClone = require('boom-clone')
var Assert = require('assert')

// Boomify a basic error, without mutating:

var basicErr = new Error('Boom!')
// Same API as Boom.wrap
var err = boomClone(basicErr, 500, 'A bad')

Assert.ok(err !== basicErr) // Not same error object
Assert.ok(basicErr.isBoom !== true) // Original NOT boomified
Assert.ok(err.isBoom) // Cloned has been boomified
Assert.equal(err.output.statusCode, 500) // Status set
Assert.equal(err.message, 'A bad') // Message set

// Clone a boom:

var boomErr = Boom.create(500)
var err = boomClone(boomErr)

Assert.ok(err !== basicErr) // Not same error object
Assert.ok(err.isBoom) // still a boom though
```

## API

## `boomClone(error, [statusCode], [message])`

Return a cloned boomified error object.

* `error` A JavaScript Error object
* `[statusCode]` Optional HTTP status code
* `[message]` Optional error message

NOTE: `statusCode` and `message` are invalid params(!) if passed along with an already boomified `error`.

---

A [(╯°□°）╯︵TABLEFLIP](https://tableflip.io) side project.
