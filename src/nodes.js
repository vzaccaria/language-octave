var debug = require('debug')('lo:parser')
var escodegen = require('escodegen')

var gen = escodegen.generate

module.exports = (parser) => {

  var b = require('ast-types').builders

  parser.yy = b

  b.assignTarget = (name, indexes) => {
    debug(`Found assign target, ${gen(name)}, ${gen(indexes)}`)
    return {
      assignTarget: {
        name,
        indexes
      }
    }
  }

  b.dGenCode = (e) => {
    debug(escodegen.generate(e))
  }

  b.extCallExpression = (name, args) => {
    debug(`Received function call ${name} with args ${JSON.stringify(args)}`)
    var ret = b.callExpression(b.identifier(name), args)
    b.dGenCode(ret)
    return ret
  }

  b.assign = (assignTarget, value) => {
    debug(`Received assign target ${JSON.stringify(assignTarget)}`)
    var parameters = [assignTarget].concat([value])
    b.extCallExpression('massign', parameters)
  }

  b.getArgs = (arg) => {
    debug(`Getting arg ${arg}`)
    return arg
  }

  b.arrayAccess = (name, indexes) => {
    debug(`Received array access to ${name}, indexes ${JSON.stringify(indexes)}`)
    /** Use computed = true (3rd argument) to make it appear like an array assignment */
    return b.memberExpression(b.identifier(name), (indexes), true)
  }


  return parser
}
