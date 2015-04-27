var $ = require('./util')
var _ = require('lodash')
var $$ = require('string-tools')

var scalarOperators = $.escape([
  "~", ";", ",", ":", "=", "(", ")", "[", "]", "&",
  "-", "+", "*", "/", "<", ">", "^", "|"
])

var rejectUndefined = $.leafs({
  UNDEFINED: '.'
})

var skipComments = $.skip([
  '%.*',
  '!.*'
])

var simpleTokens = $.leafs({
  IDENTIFIER: '{L}({L}|{D})*',
  CONSTANT: [
    '{D}*\\.{D}+({E})?',
    '{D}+\\.{D}*({E})?',
    '{D}+({E})?'
  ],
  EOF: "$"
})

var skipSpaces = $.skip([
  '[ \\t\\v\\f]'
])

var arrayOperators = $.leafs({
  CR: '\\n',
  ARRAYMUL: $$.escapeRegExp(".*"),
  ARRAYPOW: $$.escapeRegExp(".^"),
  ARRAYDIV: $$.escapeRegExp("./"),
  ARRAYRDIV: $$.escapeRegExp(".\\"),
  LE_OP: $$.escapeRegExp("<="),
  GE_OP: $$.escapeRegExp(">="),
  EQ_OP: $$.escapeRegExp("=="),
  NE_OP: $$.escapeRegExp("~=")
})

var keywords = $.asIs([
  "break", "clear", "else", "end", "elseif", "for",
  "function", "global", "if", "return", "while", $$.escapeRegExp("\\")
])

var string = $.leafs({
  'STRING_LITERAL': "'[^'\\n]*'"
})

var rules = [
  skipComments,
  skipSpaces,
  keywords,
  simpleTokens,
  arrayOperators,
  scalarOperators,
  string,
  rejectUndefined
]


var grammar = {
  macros: {
    D: '[0-9]',
    L: '[a-zA-Z_]',
    E: '[DdEe][+-]?{D}+'
  },

  rules: _.reduce(rules, (a, e) => {
    return a.concat(e)
  }, [])
}

var JisonLex = require('jison-lex');

function lexInput(input) {
  var lexer = new JisonLex(grammar);
  lexer.setInput(input);
  var lexed
  var lexArr = []
  while ((lexed = lexer.lex()) !== 'EOF') {
    lexArr = lexArr.concat([lexed])
  }
  return lexArr
}

module.exports = {
  grammar: grammar,
  lexInput: lexInput
}