import fs from 'fs';
import async from 'async';

const officeCoordinates = {
	latitude: 53.339428,
	longitude: -6.257664
};

const calculateDistance = (customer) => {
	const R = 6371; // Radius of the earth in km
	let dLat = deg2rad(officeCoordinates.latitude - parseInt(customer.latitude));
	let dLon = deg2rad(officeCoordinates.longitude - parseInt(customer.longitude));
	let a =
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(parseInt(customer.latitude))) * Math.cos(deg2rad(parseInt(customer.latitude))) *
		Math.sin(dLon/2) * Math.sin(dLon/2)
	;
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return R * c;
};

const deg2rad = (deg) => {
	return deg * (Math.PI/180);
};

const validify = (data, callback) => {
	async.waterfall([
		function(callback) {
			data == null ? callback(new Error('Cannot validify empty data')) : data.length === 0 ? callback(new Error('Empty array')) : callback(null, data);
		},
		function(data, callback) {
			let flag = data.some((x) => {
				if(!x.hasOwnProperty('latitude') || !x.hasOwnProperty('user_id') || !x.hasOwnProperty('name') || !x.hasOwnProperty('longitude')) {
					console.log('invalid data');
					return true;
				} else {
					return false;
				}
			});
			flag ? callback(new Error('Data properties missing or wrong')) : callback(null, data);
		}
	], function(err, data) {
		err ? callback(err) : callback(null, data);
	});
};

const readData = (path, callback) => {
		fs.exists(path, function(exists) {
			if(exists) {
				fs.readFile('customers.txt', {encoding: "utf8"}, function(err, data) {
					if(err) {
						callback(err);
					}
					callback(null, data);
				});
			} else {
				callback(new Error('file does not exist'));
			}
		});
};

const nearestCustomers = (customers, callback) => {
	let result = [];
	customers.forEach((customer) => {
		if(calculateDistance(customer) < 100) {
			result.push({ name: customer.name, user_id: customer.user_id });
		}
	});
	result.sort((a, b) => a.user_id - b.user_id);
	callback(null, result);
};

function main() {
	async.waterfall([
		function(callback) {
			readData('./customers.txt', callback);
		},
		function(data, callback) {
			let customersData = data.split('\n').map(x => JSON.parse(x));
			validify(customersData, callback);
		},
		function(data, callback) {
			nearestCustomers(data, callback);
		}
	], function (err, result) {
		if(err) {
			console.log(err);
		} else {
			console.log('Customers within 100km');
			result.forEach((customer) => {
				console.log(JSON.stringify(customer, null, 2));
			})
		}
	});
}

main();