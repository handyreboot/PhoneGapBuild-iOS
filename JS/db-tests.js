var db_tests = {};

db_tests.closeEnough = function (value1, value2) {
	'use strict';
	var quotient = value1 / value2;
	return quotient < 1.005 && quotient > 0.995;
};

db_tests.DB_NAME = 'measuredhs-mobile.db';

db_tests.setup = function(callBack) {
	'use strict';

	db_tests.database = local_resources.createDatabase(db_tests.DB_NAME, '1.0', db_tests.DB_NAME, 5000000);
	local_resources.createTables(db_tests.database);

	db_tests.files = local_resources.getJsonUpdateFiles('data/data-update.json');

	var resultHander = function () {
		callBack(db_tests.database);
	}

	local_resources.populateDatabase(db_tests.database, db_tests.files, resultHander);
}

db_tests.runTests = function () {
	'use strict';

	var DB_NAME = 'measuredhs-mobile.db',
		TABLE_NAME = 'offline_jsonresources';

	test('.createDatabase()', function () {
		var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);
		ok(database, 'Database created successfully');
	});

	asyncTest('.createTables()', function () {
		var resultHandler = function(results) {
			ok(results, JSON.stringify(results));
			start();
		}

		var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);
		local_resources.createTables(database, resultHandler);
	});

	//TODO: Make Async...
	test('.insertJsonFile(database, url, name, version, json)', function() {
		'use strict';
		var mockJson = {};
		mockJson.DATA = '234sdfasgaert3';

		var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);
		local_resources.createTables(database);
		local_resources.insertJsonFile(database, 'testing_url', 'testing_name', 'testing_version', JSON.stringify(mockJson));
		
		ok(database, 'Table Insert Successful');
	});

	//TODO: Make Async...
	test('.updateJsonFile(database, name, url, version, json)', function () {
		'use strict';
		var mockJson = {};
		mockJson.state = 'updatedJson';
		mockJson.DATA = '234sdfasgaert3';

		var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);
		local_resources.createTables(database);
		local_resources.updateJsonFile(database, 'testing_name', 'changed_url', 'updated_version', JSON.stringify(mockJson));
		
		ok(database, 'Row Updated Successful');
	});

	asyncTest('.populateDatabaseJSON(database, updateFiles, "json", resultHander)', function () {
		'use strict';
		var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);

		local_resources.getJsonUpdateFiles('data/data-update.json', 'json', function (data) {
			var updateFiles = data;
			local_resources.populateDatabase(database, updateFiles, 'json', function (error, results) {
				console.log('.populateDatabase.resultHander(' + JSON.stringify(arguments) + ')');
				ok(!error, error);
				ok(updateFiles, JSON.stringify(updateFiles));
				start();
			});
		});
	});

	asyncTest('.populateDatabaseJSONP(database, updateFiles, "jsonp", resultHander)', function () {
		'use strict';
		var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);
		
		local_resources.getJsonUpdateFiles('http://statcompiler.blueraster.net/API/DHS/checkForDataUpdates/', 'jsonp', function (data) {
			var updateFiles = data;
			local_resources.populateDatabase(database, updateFiles, 'jsonp', function (error, results) {
				console.log('.populateDatabase.resultHander(' + JSON.stringify(arguments) + ')');
				ok(!error, error);
				ok(updateFiles, JSON.stringify(updateFiles));
				start();
			});
		});
	});

	asyncTest(".selectRows(database, query, callBack)", function () {
		'use strict';
		var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);

		var sql = "SELECT name,json FROM " + TABLE_NAME;

		var resultHandler = function (rows) {
			if(rows.length === 0) {
				populateDatabase
			}
			ok(rows, JSON.stringify(rows));
			start();
		}

		local_resources.selectRows(database, sql, resultHandler);
    });

    asyncTest(".deleteByName(database, name, callBack)", function () {
    	'use strict';
		var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);

		var resultHandler = function (resultObject) {
			ok(resultObject, JSON.stringify(resultObject));
			start(); 
		}

		local_resources.deleteByName(database, 'getCountries', resultHandler);
    });

    asyncTest('.checkForUpdates(database, updateUrl)', function () {
    	'use strict';
		var updateUrl = 'http://statcompiler.blueraster.net/API/DHS/checkForDataUpdates/';
		var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);
		var resultHandler = function (error, results) {
			ok(!error, error);
			start(); 
		}
	
		local_resources.checkForUpdates(database, updateUrl, 'jsonp', resultHandler);
	});

    asyncTest(".getJsonByName(database, name, callBack)", function() {
    	'use strict';
    	var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);

    	var resultHandler = function (resultObject) {
			ok(resultObject, JSON.stringify(resultObject));
			start(); 
		}

		local_resources.getJsonByName(database, 'getQuickStats', resultHandler);
    });

    asyncTest(".getNameHashTable(database, callBack)", function() {
    	'use strict';
		var database = local_resources.createDatabase(DB_NAME, '1.0', DB_NAME, 5000000);

		var resultHandler = function(rows) {
			ok(rows, JSON.stringify(rows));
			start();
		}

		local_resources.getNameHashTable(database, resultHandler);
    });

}


