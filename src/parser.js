var jison = require('jison')
var {
  Parser
} = jison
jison.print = () => {}

var lex = require('./lexer').grammar

var unwrap = /^function\s*\(\)\s*\{\s*return\s*([\s\S]*);\s*\}/


function o(patternString, action, options) {
  patternString = patternString.replace(/\s{2,}/g, ' ')
  if (action === undefined || action === null) {
    return [patternString, '$$ = $1;', options]
  }
  var match
  if ((match = unwrap.exec(action))) {
    action = match[1];
  } else {
    action = `(${action})()`
  }

  // action = action.replace(/\bnew /g, '$&yy.')
  // action = action.replace(/\b(?:Block\.wrap|extend)\b/g, 'yy.$&')

  return [patternString, `$$ = (yy.${action});`, options]
}



/* global $1, $2, $3, $,
   Var, Literal, Str, yy, z,
   identifier, assignTarget, literal, expression, callExpression */

var startRule = 'translation_unit'

var grammar = {

  primary_expression: [
    o('IDENTIFIER', () => identifier($1)),
    o('CONSTANT', () => literal(parseFloat($1))),
    o('STRING_LITERAL', () => literal($1)),
    o('expression', () => expression($1)),
    o('[ ]', () => literal([])),
    o('[ array_list ]')
  ],

  postfix_expression: [
    o('primary_expression'),
    o('array_expression')
    // o('postfix_expression TRANSPOSE'),
    // o('postfix_expression NCTRANSPOSE')
  ],

  index_expression: [
    o('expression : expression : expression'),
    o('expression : expression'),
    o('expression'),
    o(':', () => literal('__M_ALL__')),
  ],

  index_expression_list: [
    o('index_expression'),
    o('index_expression_list , index_expression')
  ],

  array_expression: [
    o('IDENTIFIER ( index_expression_list )')
  ],

  unary_expression: [
    o('postfix_expression'),
    o('unary_operator postfix_expression')
  ],

  unary_operator: [
    '+',
    '-',
    '~'
  ],

  multiplicative_expression: [
    o('unary_expression'),
    o('multiplicative_expression * unary_expression'),
    o('multiplicative_expression / unary_expression'),
    o('multiplicative_expression \\ unary_expression'),
    o('multiplicative_expression ^ unary_expression'),
    o('multiplicative_expression ARRAYMUL unary_expression'),
    o('multiplicative_expression ARRAYDIV unary_expression'),
    o('multiplicative_expression ARRAYRDIV unary_expression'),
    o('multiplicative_expression ARRAYPOW unary_expression')
  ],

  additive_expression: [
    o('multiplicative_expression'),
    o('additive_expression + multiplicative_expression'),
    o('additive_expression - multiplicative_expression')
  ],

  relational_expression: [
    o('additive_expression'),
    o('relational_expression < additive_expression'),
    o('relational_expression > additive_expression'),
    o('relational_expression LE_OP additive_expression'),
    o('relational_expression GE_OP additive_expression')
  ],

  equality_expression: [
    o('relational_expression'),
    o('equality_expression EQ_OP relational_expression'),
    o('equality_expression NE_OP relational_expression')
  ],

  and_expression: [
    o('equality_expression'),
    o('and_expression & equality_expression')
  ],

  or_expression: [
    o('and_expression'),
    o('or_expression | and_expression')
  ],

  expression: [
    o('or_expression'),
    o('( expression )', () => getArgs($2))
  ],


  assignment_expression: [
    o('IDENTIFIER = expression', () => assign($1, [], $3)),
    o('IDENTIFIER ( index_expression ) = expression', () => assign($1, [$3], $6)),
    o('IDENTIFIER ( index_expression , index_expression ) = expression', () => assign($1, [$3, $5], $8))
  ],

  eostmt: [
    o(','),
    o(';'),
    o('CR')
  ],

  statement: [
    o('define_function_statement'),
    o('global_statement'),
    o('clear_statement'),
    o('assignment_statement'),
    o('expression_statement'),
    o('selection_statement'),
    o('iteration_statement'),
    o('jump_statement'),
    o('eostmt')
  ],

  statement_list: [
    o('statement'),
    o('statement_list statement')
  ],

  identifier_list: [
    o('IDENTIFIER'),
    o('identifier_list IDENTIFIER')
  ],

  global_statement: [
    o('GLOBAL identifier_list eostmt')
  ],

  clear_statement: [
    o('CLEAR identifier_list eostmt')
  ],

  expression_statement: [
    o('eostmt'),
    o('expression eostmt')
  ],

  assignment_statement: [
    o('assignment_expression eostmt', () => dGenCode($1))
  ],

  array_element: [
    o('expression'),
    o('expression_statement')
  ],

  array_list: [
    o('array_element'),
    o('array_list array_element')
  ],

  selection_statement: [
    o('IF expression statement_list END eostmt'),
    o('IF expression statement_list ELSE statement_list END eostmt'),
    o('IF expression statement_list elseif_clause END eostmt'),
    o('IF expression statement_list elseif_clause ELSE statement_list END eostmt')
  ],

  elseif_clause: [
    o('ELSEIF expression statement_list'),
    o('elseif_clause ELSEIF expression statement_list')
  ],

  iteration_statement: [
    o('WHILE expression statement_list END eostmt'),
    o('FOR IDENTIFIER = expression statement_list END eostmt'),
    o('FOR ( IDENTIFIER = expression ) statement_list END eostmt')
  ],

  jump_statement: [
    o('BREAK eostmt'),
    o('RETURN eostmt')
  ],

  define_function_statement: [
    o('FUNCTION function_declare eostmt statement_list END')
  ],

  translation_unit: [
    o('statement_list EOF')
  ],

  func_ident_list: [
    o('IDENTIFIER'),
    o('func_ident_list , IDENTIFIER')
  ],

  func_return_list: [
    o('IDENTIFIER'),
    o('[ func_ident_list ]')
  ],

  function_declare_lhs: [
    o('IDENTIFIER ( )'),
    o('IDENTIFIER ( func_ident_list )')
  ],

  function_declare: [
    o('function_declare_lhs'),
    o('func_return_list = function_declare_lhs')
  ]
}

var parserConfig = {
  lex: lex,
  bnf: grammar,
  startSymbol: startRule
}


var parser = new Parser(parserConfig)


parser = require('./nodes')(parser)

/* Tests from here on.. */


var test = `
a(3,1)=c
`



console.log(JSON.stringify(parser.parse(test), 0, 4))

throw "Inspect!"

// prettyPrint(parser.parse(test))

/* Add constructors */

module.exports = {
  parser
}