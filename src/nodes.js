var debug = require('debug')('lo:parser')
var escodegen = require('escodegen')
var _ = require('lodash')
var gen = escodegen.generate
var sweet = require('sweet.js')

var unQ = (quoted) => gen(quoted)
var Q = (string) => sweet.parse(string).body[0]



function setMatrix(m, indexes, value) {
  if (indexes.length === 0) {
    return Q(`${(m)} = ${unQ(value)}`)
  } else {
    indexes = _.map(indexes, unQ).join(',')
    return Q(`${(m)}.subset(math.index(${indexes}), ${unQ(value)})`)
  }
}



module.exports = (parser) => {

  var b = require('ast-types').builders

  parser.yy = b

  b.dGenCode = (e) => {
    debug(JSON.stringify(e, 0, 4))
    debug(escodegen.generate(e))
    return e;
  }

  b.assign = (identifier, indexes, value) => {
    return setMatrix(identifier, indexes, value)
  }

  b.getArgs = (arg) => {
    return arg
  }

  return parser
}