var chai = require('chai')
chai.use(require('chai-as-promised'))
var should = chai.should()
var _ = require('lodash')

/*global describe, it, before, beforeEach, after, afterEach */


var {
  lexInput
} = require('..')

var check = function (ref) {
  var l = lexInput(ref[0])
    // console.log(l);
  l.should.eql(ref[1])
}

describe('#module', () => {
  it('should load the module', () => {
    should.exist(lexInput)
  })

  describe("#simpleExpressions", () => {
    var tests = [
      ['a=1', ['IDENTIFIER', '=', 'CONSTANT']],
      ['a <= b', ['IDENTIFIER', 'LE_OP', 'IDENTIFIER']],
      ['a >= b', ['IDENTIFIER', 'GE_OP', 'IDENTIFIER']],
      ['a & b', ['IDENTIFIER', '&', 'IDENTIFIER']],
      ['a && b', ['IDENTIFIER', '&', '&', 'IDENTIFIER']],
      ['a | b', ['IDENTIFIER', '|', 'IDENTIFIER']],
      ['a || b', ['IDENTIFIER', '|', '|', 'IDENTIFIER']],
      ['a=1+1', ['IDENTIFIER', '=', 'CONSTANT', '+', 'CONSTANT']],
      ['a=1*112', ['IDENTIFIER', '=', 'CONSTANT', '*', 'CONSTANT']],
      ['a=1.1*112', ['IDENTIFIER', '=', 'CONSTANT', '*', 'CONSTANT']],
      ['b = 1.1 * 112', ['IDENTIFIER', '=', 'CONSTANT', '*', 'CONSTANT']],
      ['c = a - b', ['IDENTIFIER', '=', 'IDENTIFIER', '-', 'IDENTIFIER']],
      ['c = 3 - 1', ['IDENTIFIER', '=', 'CONSTANT', '-', 'CONSTANT']],
      ["c = '3' - 1", ['IDENTIFIER', '=', 'STRING_LITERAL', '-', 'CONSTANT']]
    ]
    _.map(tests, (x) => {
      it(`should parse ${x[0]}`, () => {
        check(x)
      })
    })
  })
  describe("#compoundExpressions", () => {
    var tests = [
      ['.', ['UNDEFINED']],
      ['.1212', ['CONSTANT']],
      ['a=(1)', ['IDENTIFIER', '=', '(', 'CONSTANT', ')']],
      ['a=(1.1*112)+1', ['IDENTIFIER', '=', '(', 'CONSTANT', '*', 'CONSTANT', ')', '+', 'CONSTANT']],
      ['c = a - (b+c)', ['IDENTIFIER', '=', 'IDENTIFIER', '-', '(', 'IDENTIFIER', '+', 'IDENTIFIER', ')']],
      ['c = ((3 - 1) + a)', ['IDENTIFIER', '=', '(', '(', 'CONSTANT', '-', 'CONSTANT', ')', '+', 'IDENTIFIER', ')']],
      [" a=[ a 'x'] ", ['IDENTIFIER', '=', '[', 'IDENTIFIER', 'STRING_LITERAL', ']']]
    ]
    _.map(tests, (x) => {
      it(`should parse ${x[0]}`, () => {
        check(x)
      })
    })
  })
  describe("#conditionals", () => {
    var tests = [
      ['if(a==1) a=1 end', ['IF', '(', 'IDENTIFIER', 'EQ_OP', 'CONSTANT', ')', 'IDENTIFIER', '=', 'CONSTANT', 'END']],
      ['if(a~=3) x=1 else x=3 end', ['IF', '(', 'IDENTIFIER', 'NE_OP', 'CONSTANT', ')', 'IDENTIFIER', '=', 'CONSTANT', 'ELSE', 'IDENTIFIER', '=', 'CONSTANT', 'END']]
    ]
    _.map(tests, (x) => {
      it(`should parse ${x[0]}`, () => {
        check(x)
      })
    })
  })
  describe("#loops", () => {
    var tests = [
      ["for x=1:3 a=[ a 'x'] end", ['FOR', 'IDENTIFIER', '=', 'CONSTANT', ':', 'CONSTANT', 'IDENTIFIER', '=', '[', 'IDENTIFIER', 'STRING_LITERAL', ']', 'END']],
      ["while(x ~= 3) x=x-1 end", ['WHILE', '(', 'IDENTIFIER', 'NE_OP', 'CONSTANT', ')', 'IDENTIFIER', '=', 'IDENTIFIER', '-', 'CONSTANT', 'END']]
    ]
    _.map(tests, (x) => {
      it(`should parse ${x[0]}`, () => {
        check(x)
      })
    })
  })

  describe("#arrayOps", () => {
    var tests = [
      ['a=[1]./[1]', ['IDENTIFIER', '=', '[', 'CONSTANT', ']', 'ARRAYDIV', '[', 'CONSTANT', ']']],
      ['a=[1].\\[1]', ['IDENTIFIER', '=', '[', 'CONSTANT', ']', 'ARRAYRDIV', '[', 'CONSTANT', ']']],
      ["a=b'", ['IDENTIFIER', '=', 'IDENTIFIER', 'UNDEFINED']]
    ]
    _.map(tests, (x) => {
      it(`should parse ${x[0]}`, () => {
        check(x)
      })
    })
  })
  describe("#functions", () => {
    var fun = `
    function r = id(x)
        r = x
    end
    `

    var tests = [
      ["function r = id(x) r = x end", ['FUNCTION', 'IDENTIFIER', '=', 'IDENTIFIER', '(', 'IDENTIFIER', ')', 'IDENTIFIER', '=', 'IDENTIFIER', 'END']],
      [fun, ['CR', 'FUNCTION', 'IDENTIFIER', '=', 'IDENTIFIER', '(', 'IDENTIFIER', ')', 'CR', 'IDENTIFIER', '=', 'IDENTIFIER', 'CR', 'END', 'CR']]
    ]
    _.map(tests, (x) => {
      it(`should parse ${x[0]}`, () => {
        check(x)
      })
    })
  })
  describe("#comments", () => {
    var fun = ` % a = 1
    function r = id(x)
    % another comment
        r = x % a<3
    end
    `

    var tests = [
      [fun, ['CR', 'FUNCTION', 'IDENTIFIER', '=', 'IDENTIFIER', '(', 'IDENTIFIER', ')', 'CR', 'CR', 'IDENTIFIER', '=', 'IDENTIFIER', 'CR', 'END', 'CR']]
    ]
    _.map(tests, (x) => {
      it(`should parse ${x[0]}`, () => {
        check(x)
      })
    })
  })
})