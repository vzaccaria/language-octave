var chai = require('chai')
chai.use(require('chai-as-promised'))
var should = chai.should()
var _ = require('lodash')

/*global describe, it, before, beforeEach, after, afterEach */


var {
  lexInput
} = require('..')


// console.log(lexInput("function [x,y] = pippo(x,y); a = x ./ y; x = 'a'; end"))
//


describe('#module', () => {
  it('should load the module', () => {
    should.exist(lexInput)
  })

  describe("#simpleExpressions", () => {
    var tests = [
      ['a=1', ['IDENTIFIER', '=', 'CONSTANT']],
      ['a=1+1', ['IDENTIFIER', '=', 'CONSTANT', '+', 'CONSTANT']],
      ['a=1*112', ['IDENTIFIER', '=', 'CONSTANT', '*', 'CONSTANT']],
      ['a=1.1*112', ['IDENTIFIER', '=', 'CONSTANT', '*', 'CONSTANT']],
      ['b = 1.1 * 112', ['IDENTIFIER', '=', 'CONSTANT', '*', 'CONSTANT']],
      ['c = a - b', ['IDENTIFIER', '=', 'IDENTIFIER', '-', 'IDENTIFIER']],
      ['c = 3 - 1', ['IDENTIFIER', '=', 'CONSTANT', '-', 'CONSTANT']]
    ]
    _.map(tests, (x) => {
      it(`should parse ${x[0]}`, () => {
        ("" + lexInput(x[0])).should.eql("" + x[1])
      })
    })
  })
})