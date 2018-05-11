import fs from 'fs';
import async from 'async';

const officeCoordinates = {
  latitude: 53.339428,
  longitude: -6.257664,
};

function isJSON(str) {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
}

/**
 * Returns the distance between the office and the customer
 * @param   {object} customer - Latitude and Longitude of a customer
 * @returns {number} Distance
 */
const calculateDistance = customer => {
  const R = 6371; // Radius of the earth in km
  let dLat = deg2rad(officeCoordinates.latitude - parseInt(customer.latitude));
  let dLon = deg2rad(
    officeCoordinates.longitude - parseInt(customer.longitude),
  );
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(parseInt(customer.latitude))) *
      Math.cos(deg2rad(parseInt(customer.latitude))) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = deg => {
  return deg * (Math.PI / 180);
};

/**
 * Validates the given data
 * @param   {Array} data - Array of customer objects.
 * @returns {Array} data - Returns the data intact if the validation is successful.
 *                         On failure, returns error.
 */

const validify = (data, callback) => {
  async.waterfall(
    [
      function(callback) {
        data == null
          ? callback(new Error('Cannot validate null data'))
          : Array.isArray(data)
            ? callback(null, data)
            : callback(new Error('Data must an Array'));
      },
      function(data, callback) {
        data.length === 0
          ? callback(new Error('Cannot validate empty data array'))
          : callback(null, data);
      },
      function(data, callback) {
        let flag = data.some(x => {
          if (
            !x.hasOwnProperty('latitude') ||
            !x.hasOwnProperty('user_id') ||
            !x.hasOwnProperty('name') ||
            !x.hasOwnProperty('longitude')
          ) {
            return true;
          } else {
            return false;
          }
        });
        flag ? callback(new Error('Invalid data')) : callback(null, data);
      },
    ],
    function(err, data) {
      err ? callback(err) : callback(null, data);
    },
  );
};

const readData = (path, callback) => {
  fs.readFile(path, { encoding: 'utf8' }, function(err, data) {
    if (err) {
      callback(err);
    }
    callback(null, data);
  });
};

/**
 * Returns customer within 100km of the company, if any.
 * @param   {Array} customers - Array of customer objects.
 * @returns {Array} result - customer list within 100km range.
 */

const nearestCustomers = (customers, callback) => {
  let result = [];
  customers.forEach(customer => {
    if (calculateDistance(customer) < 100) {
      result.push({ name: customer.name, user_id: customer.user_id });
    }
  });
  result.sort((a, b) => a.user_id - b.user_id);
  callback(null, result);
};

const cleanseData = (data, callback) => {
  let customersData = data
    .split('\n')
    .map(x => {
      if (isJSON(x)) {
        return JSON.parse(x);
      }
    })
    .filter(x => x !== undefined);
  callback(null, customersData);
};

function main() {
  async.waterfall(
    [
      function(callback) {
        readData('./customers.txt', callback);
      },
      function(data, callback) {
        cleanseData(data, callback);
      },
      function(data, callback) {
        validify(data, callback);
      },
      function(data, callback) {
        nearestCustomers(data, callback);
      },
    ],
    function(err, result) {
      if (err) {
        console.log(err.message);
      } else if (result.length === 0) {
        console.log('No customer is within 100km');
      } else {
        console.log('Customers within 100km');
        result.map(customer => {
          console.log(JSON.stringify(customer, null, 2));
        });
      }
    },
  );
}

main(); //program starting point

module.exports = {
  validify,
  nearestCustomers,
  cleanseData,
};
