process.env.NODE_ENV = 'test';
var expect = require('chai').expect;
var {readData} = require('../index');

describe('add', function () {
    // it('should add two numbers', function () {
    //
    //     // 1. ARRANGE
    //     var x = 5;
    //     var y = 1;
    //     var sum1 = x + y;
    //
    //     // 2. ACT
    //     var sum2 = addTwoNumbers(x, y);
    //
    //     // 3. ASSERT
    //     expect(sum2).to.be.equal(sum1);
    //
    // });
    it('should add', function () {
        readData('test/test.txt', (data)=> {
            console.log(data);
        });
    });
});