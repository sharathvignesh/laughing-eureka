const fs = require('fs');
const assert = require('assert');
const { validify, nearestCustomers, cleanseData } = require('../index');
const helper = require('./helper');

describe('Cleanse data', function() {
  describe('Cleanse improper data', function() {
    let fileData;
    before(callback => {
      fs.readFile(
        './test/files/bad-data.txt',
        { encoding: 'utf8' },
        (err, data) => {
          if (err) {
            console.log('File read error');
          }
          fileData = data;
          callback();
        },
      );
    });
    it('Should return cleansed data', function(callback) {
      cleanseData(fileData, (err, result) => {
        assert.notStrictEqual(result, fileData.split('\n'));
      });
      callback();
    });
  });
});

describe('Validate test data', function() {
  it('Validation success', function(callback) {
    const testData = helper.GenerateSimpleTestData();
    validify(testData, (err, data) => {
      assert.strictEqual(data, testData);
      callback();
    });
  });

  it('Empty data array error', function(callback) {
    validify([], err => {
      assert.strictEqual(err.message, 'Cannot validate empty data array');
      callback();
    });
  });

  it('Null data error', function(callback) {
    validify(null, err => {
      assert.strictEqual(err.message, 'Cannot validate null data');
      callback();
    });
  });

  it('Data type must be an Array error', function(callback) {
    validify(Math.random(), err => {
      assert.strictEqual(err.message, 'Data must an Array');
      callback();
    });
  });

  it('Invalid data error', function(callback) {
    validify(helper.GenerateErrorData(), err => {
      assert.strictEqual(err.message, 'Invalid data');
      callback();
    });
  });
});

describe('Nearest customers', function() {
  it('Should return nearest customers name and user_id', function(callback) {
    const testData = helper.GenerateSimpleTestData();
    nearestCustomers(testData, (err, result) => {
      result.forEach(x => {
        assert.strictEqual(x.hasOwnProperty('name'), true);
        assert.strictEqual(x.hasOwnProperty('user_id'), true);
      });
      callback();
    });
  });
});
