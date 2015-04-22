var _ = require('lodash')
var $$ = require('string-tools')

function asIs(argument) {
  return _.map(argument, ($) => {
    return ['' + $, `return '${$.toUpperCase()}';`]
  })
}

function escape(argument) {
  return _.map(argument, ($) => {
    return [$$.escapeRegExp($), `return '${$}';`]
  })
}

function skip(argument) {
  return _.map(argument, ($) => {
    return ['' + $, `/* skip ${$} */`]
  })
}


function skipForMore(argument) {
  return _.map(argument, ($) => {
    return ['' + $, `this.more()`]
  })
}

var leafs = function (argument) {
  return _.flatten(_.values(_.mapValues(argument, (v, k) => {
    if (!(v instanceof Array)) {
      v = [v]
    }
    return _.map(v, (x) => {
      return [x, `return '${k}';`]
    })
  })))
}


module.exports = {
  leafs, asIs, escape, skip, skipForMore
}