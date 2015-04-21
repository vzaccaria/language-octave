// var shelljs = require('shelljs')
// var promise = require('bluebird')

/*::
  type lodashT = {
    map: (l: Array<any>, c: (v: any, k: any) => any) => Array<any>;
  }
*/


var _ /*: lodashT */ = require('lodash')

/*::
  type expectArrayT = (a: Array<any>|any) => Array<any>
*/
var expectArray /*: expectArrayT */ = function (argument) {
  if (!(argument instanceof Array)) {
    argument = [argument];
  }
  return argument
}


/*::
    type BuildRuleT = { regex: string, token: string }
    type BuildRuleC = ( regex: string, token: string) => BuildRuleT
*/
var buildRule /*: BuildRuleC */ = function (regex, token) {
  return {
    regex, token
  }
}


function asIs(argument) {
  argument = expectArray(argument)
  return _.map(argument, ($) => {
    return buildRule($, $.toUpperCase())
  })
}

function precedes(newstate, ...arrOf$) {
  return _.map(arrOf$, ($) => {
    _.map($, (v) => {
      v.next = newstate;
      return v
    })
    return $
  })
}

function inState(newstate, ...vals) {
  return _.map(vals, ($) => {
    $ = _.map(_.flattenDeep($), (x) => {
      x.current = newstate
      return x
    })
    return $
  })
}

function skip(argument) {
  argument = expectArray(argument)
  return _.map(argument, ($) => {
    return buildRule($, "")
  })
}

function skipForMore(argument) {
  argument = expectArray(argument)
  return _.map(argument, ($) => {
    return buildRule($, "__MORE")
  })
}

/*::
  type leafMapT = { [key: string]: string | Array<string> }
  type leafsF = (argument: leafMapT) => Array<BuildRuleT>
 */

var leafs /*: leafsF */ = function (argument) {
  return _.flattenDeep(_.values(_.mapValues(argument, (v, k) => {
    if (!(v instanceof Array)) {
      v = [v]
    }
    return _.map(v, (x) => {
      return buildRule(x, k)
    })
  })))
}



function produce(...states) {
  return _.flattenDeep(states)
}

module.exports = {
  produce, leafs, skip, precedes, asIs, skipForMore, inState
}