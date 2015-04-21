var chai = require('chai')
chai.use(require('chai-as-promised'))
var should = chai.should()
var _ = require('lodash')

/*global describe, it, before, beforeEach, after, afterEach */


var mod;
var lexer;

var run = (_) => {
  return _.produce(

    _.inState('initial',

      _.leafs({
        D: '[0-9]',
        L: '[a-zA-Z_]',
        E: '[DdEe][+-]?{D}+'
      }),

      _.skip([
        '"%".*$',
        '"!".*$'
      ]),

      _.precedes('string',

        _.skip([
          '[ \\t\\v\\f]',
          '.'
        ]),

        _.asIs([
          "break", "clear", "else", "end", "elseif", "for",
          "function", "global", "if", "return", "while",
          "~", ";", ",", ":", "=", "(", ")", "[", "]", "&",
          "-", "+", "*", "/", "\\\\", "<", ">", "^", "|"
        ]),

        _.leafs({
          CR: '\\n',
          ARRAYMUL: ".*",
          ARRAYPOW: ".^",
          ARRAYDIV: "./",
          ARRAYRDIV: ".\\",
          LE_OP: "<=",
          GE_OP: ">=",
          EQ_OP: "==",
          NE_OP: "~="
        })
      ),

      _.precedes('transpose', _.leafs({
          TRANSPOSE: ".'",
          IDENTIFIER: '{L}({L}|{D})*',
          CONSTANT: [
            "{D}+({E})?",
            "{D}*",
            "{D}+({E})?",
            "{D}+",
            "{D}*({E})?"
          ]
        }),

        _.asIs([
          "]"
        ])
      )
    ),


    _.inState('string',

      _.skipForMore([
        "'[^'\n]*'/'"
      ]),

      _.precedes('initial',
        _.leafs({
          'STRING_LITERAL': "'[^'\n]*'"
        }))
    ),


    _.inState('transpose',

      _.precedes('transpose', _.leafs({
        'TRANSPOSE': "'"
      }))
    )
  )
}

var shouldContain = [{
  regex: '[0-9]',
  token: 'D',
  current: 'initial'
}, {
  regex: '[a-zA-Z_]',
  token: 'L',
  current: 'initial'
}, {
  regex: '[DdEe][+-]?{D}+',
  token: 'E',
  current: 'initial'
}, {
  regex: '"%".*$',
  token: '',
  current: 'initial'
}, {
  regex: '"!".*$',
  token: '',
  current: 'initial'
}, {
  regex: '[ \\t\\v\\f]',
  token: '',
  next: 'string',
  current: 'initial'
}, {
  regex: '.',
  token: '',
  next: 'string',
  current: 'initial'
}, {
  regex: 'break',
  token: 'BREAK',
  next: 'string',
  current: 'initial'
}, {
  regex: 'clear',
  token: 'CLEAR',
  next: 'string',
  current: 'initial'
}, {
  regex: 'else',
  token: 'ELSE',
  next: 'string',
  current: 'initial'
}, {
  regex: 'end',
  token: 'END',
  next: 'string',
  current: 'initial'
}, {
  regex: 'elseif',
  token: 'ELSEIF',
  next: 'string',
  current: 'initial'
}, {
  regex: 'for',
  token: 'FOR',
  next: 'string',
  current: 'initial'
}, {
  regex: 'function',
  token: 'FUNCTION',
  next: 'string',
  current: 'initial'
}, {
  regex: 'global',
  token: 'GLOBAL',
  next: 'string',
  current: 'initial'
}, {
  regex: 'if',
  token: 'IF',
  next: 'string',
  current: 'initial'
}, {
  regex: 'return',
  token: 'RETURN',
  next: 'string',
  current: 'initial'
}, {
  regex: 'while',
  token: 'WHILE',
  next: 'string',
  current: 'initial'
}, {
  regex: '~',
  token: '~',
  next: 'string',
  current: 'initial'
}, {
  regex: ';',
  token: ';',
  next: 'string',
  current: 'initial'
}, {
  regex: ',',
  token: ',',
  next: 'string',
  current: 'initial'
}, {
  regex: ':',
  token: ':',
  next: 'string',
  current: 'initial'
}, {
  regex: '=',
  token: '=',
  next: 'string',
  current: 'initial'
}, {
  regex: '(',
  token: '(',
  next: 'string',
  current: 'initial'
}, {
  regex: ')',
  token: ')',
  next: 'string',
  current: 'initial'
}, {
  regex: '[',
  token: '[',
  next: 'string',
  current: 'initial'
}, {
  regex: ']',
  token: ']',
  next: 'string',
  current: 'initial'
}, {
  regex: '&',
  token: '&',
  next: 'string',
  current: 'initial'
}, {
  regex: '-',
  token: '-',
  next: 'string',
  current: 'initial'
}, {
  regex: '+',
  token: '+',
  next: 'string',
  current: 'initial'
}, {
  regex: '*',
  token: '*',
  next: 'string',
  current: 'initial'
}, {
  regex: '/',
  token: '/',
  next: 'string',
  current: 'initial'
}, {
  regex: '\\\\',
  token: '\\\\',
  next: 'string',
  current: 'initial'
}, {
  regex: '<',
  token: '<',
  next: 'string',
  current: 'initial'
}, {
  regex: '>',
  token: '>',
  next: 'string',
  current: 'initial'
}, {
  regex: '^',
  token: '^',
  next: 'string',
  current: 'initial'
}, {
  regex: '|',
  token: '|',
  next: 'string',
  current: 'initial'
}, {
  regex: '\\n',
  token: 'CR',
  next: 'string',
  current: 'initial'
}, {
  regex: '.*',
  token: 'ARRAYMUL',
  next: 'string',
  current: 'initial'
}, {
  regex: '.^',
  token: 'ARRAYPOW',
  next: 'string',
  current: 'initial'
}, {
  regex: './',
  token: 'ARRAYDIV',
  next: 'string',
  current: 'initial'
}, {
  regex: '.\\',
  token: 'ARRAYRDIV',
  next: 'string',
  current: 'initial'
}, {
  regex: '<=',
  token: 'LE_OP',
  next: 'string',
  current: 'initial'
}, {
  regex: '>=',
  token: 'GE_OP',
  next: 'string',
  current: 'initial'
}, {
  regex: '==',
  token: 'EQ_OP',
  next: 'string',
  current: 'initial'
}, {
  regex: '~=',
  token: 'NE_OP',
  next: 'string',
  current: 'initial'
}, {
  regex: '.\'',
  token: 'TRANSPOSE',
  next: 'transpose',
  current: 'initial'
}, {
  regex: '{L}({L}|{D})*',
  token: 'IDENTIFIER',
  next: 'transpose',
  current: 'initial'
}, {
  regex: '{D}+({E})?',
  token: 'CONSTANT',
  next: 'transpose',
  current: 'initial'
}, {
  regex: '{D}*',
  token: 'CONSTANT',
  next: 'transpose',
  current: 'initial'
}, {
  regex: '{D}+({E})?',
  token: 'CONSTANT',
  next: 'transpose',
  current: 'initial'
}, {
  regex: '{D}+',
  token: 'CONSTANT',
  next: 'transpose',
  current: 'initial'
}, {
  regex: '{D}*({E})?',
  token: 'CONSTANT',
  next: 'transpose',
  current: 'initial'
}, {
  regex: ']',
  token: ']',
  next: 'transpose',
  current: 'initial'
}, {
  regex: '\'[^\'\n]*\'/\'',
  token: '__MORE',
  current: 'string'
}, {
  regex: '\'[^\'\n]*\'',
  token: 'STRING_LITERAL',
  next: 'initial',
  current: 'string'
}, {
  regex: '\'',
  token: 'TRANSPOSE',
  next: 'transpose',
  current: 'transpose'
}]



describe('#module', () => {
  it('should load the module', () => {

    mod = require('..')
    should.exist(mod)
    lexer = run(mod)
  })

  _.map(shouldContain, (t) => {
    it(`should contain ${t.token}`, () => {
      lexer.should.contain(t)
    })
  })
})