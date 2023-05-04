var copyError = require('utils-copy-error')
var Boom = require('boom')

function boomClone (err, statusCode, message) {
  return Boom.wrap(copyError(err), statusCode, message)
}

module.exports = boomClone
