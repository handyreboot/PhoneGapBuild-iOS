
//Generic JQuery Error Handling Function...
$(function() {
    $.ajaxSetup({
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status === 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status === 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });
});

var local_resources = {};

var JSON_TABLE = 'offline_jsonresources';

local_resources.init = function () {
	//console.log('local_resources.init');
};

local_resources.createDatabase = function (dbName, dbVersion, displayName, maxSize) {
    try {
        if (!window.openDatabase) { 
            alert('database not supported!'); 
        } else {
          var db = window.openDatabase(dbName, dbVersion, displayName, maxSize);
          return db;
        }

    } catch(e) { 
        // Error handling code goes here. 
        if (e == INVALID_STATE_ERR) { 
            // Version number mismatch. 
            alert("Invalid database version."); 
            
        } else { 
            alert("Unknown error " + e + "."); 
        } 
        return; 
    } 
};

local_resources.createTables = function (database, callback) {
    database.transaction(function (tx) {  
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + JSON_TABLE + ' (url, name unique, json, version)');

        if(callback){
            callback({success:true});
       }
        
    });
};

local_resources.insertJsonFile = function (database, url, name, version, json) {

    var successHandler = function () {
        //console.log('row inserted into database!');
    };

    var errorHandler = function () {
        //console.log('error while inserting row into db!');
    };

    database.transaction(function (tx) {
      tx.executeSql('INSERT INTO '
        + JSON_TABLE
        + ' (url, name, version, json) VALUES (?,?,?,?)'
        , [url, name, version, json], successHandler, errorHandler);
    });
};

local_resources.updateJsonFile = function (database, name, url, version, json) {
     
    var successHandler = function () {
        //console.log('row successfully updated!');
    };

    var errorHandler = function () {
        //console.log('error while updating row into db!' + ' row name: ' + name);
    };

    database.transaction(function (tx) {
      tx.executeSql("UPDATE " + 
                    JSON_TABLE + 
                    " SET url=?, version=?, json=? WHERE name=?;",[url, version, json, name], successHandler, errorHandler);
    });
};

local_resources.getJsonUpdateFiles = function (url, dataType, callback) {
    if(dataType == null) {
        dataType = 'json'
    }

    var updateObjects = null;
     $.ajax({
        url: url,
        type: 'get',
        dataType: dataType,
        success: callback 
     });
};

local_resources.checkForUpdates = function (database, updateUrl, format, mainCallback) {

    var updateFiles = null;

     $.ajax({
        url: updateUrl,
        dataType: format,
        success: function (data) {
            updateFiles = data;
            var nameHashTable = null;
            local_resources.getNameHashTable(database, function (versionHashTable) {
                var validNames = [];
                async.forEach(updateFiles, function(f, callback) {
                    validNames.push(f.name);
                    if(versionHashTable.hasOwnProperty(f.name) && versionHashTable[f.name] === f.version) {
                        //console.log('Currently up-to-date: ' + f.name + ' : ' + f.url);
                        callback(null, f);
                    } else {
                        //console.log(f.name + ': STEP 1');
                        $.ajax({
                            url: f.url,
                            dataType: format,
                            success: function (data) {
                                if(!versionHashTable.hasOwnProperty(f.name)) {
                                    local_resources.insertJsonFile(database, f.url, f.name, f.version, JSON.stringify(data));
                                    //console.log('Inserted new file: ' + f.name + ' : ' + f.url);
                                } else {
                                    local_resources.updateJsonFile(database, f.name, f.url, f.version, JSON.stringify(data));
                                    //console.log('Updated existing file: ' + f.name + ' : ' + f.url);
                                }
                                callback(null, f);
                            }
                        });
                    }
                },
                function (error, results) {
                   for(var name in versionHashTable) {
                        if(validNames.indexOf(name) === -1) {
                            local_resources.deleteByName(database, name, function (resultObject) {
                                //console.log('Removed file: ' + resultObject.name + ' : ' + resultObject.success);
                            });
                        }
                   }

                   mainCallback(error, results);
                });
            });
        }
    });
};

local_resources.populateDatabase = function (database, updateFiles, dataType, mainCallBack) {
    /*
    Retrieve and insert json files into database. 
    */
    if(dataType == null) {
        dataType = 'json'
    }

    if(!mainCallBack) {
        mainCallBack = function (err, res) {
            //console.log('No mainCallBack specified on populate database.');
        }
    }

    if(!updateFiles) {
        //console.error('No updated files provided')
        mainCallBack({error:'No updated files provided'}, null);
        return;
    }

    async.forEach(updateFiles, function(item, callback) {
            //console.log(item.name + ': STEP 1');
            $.ajax({
                url: item.url,
                dataType: dataType,
                success: function (data) {
                    var result = {};
                    item.successfulGet = true;
                    item.data = data;
                    callback(null, item);
                }
            });
        },
        function (error, results) {
            database.transaction(function (tx) {
                for (var i = 0; i < updateFiles.length; i++) {
                  var item = updateFiles[i];
                  if(item.data) {
                    tx.executeSql('INSERT INTO ' + JSON_TABLE +
                        ' (url, name, version, json) VALUES (?,?,?,?)'
                        ,[item.url, item.name, item.version, JSON.stringify(item.data)]);
                    };
                  }
                mainCallBack(error, results);
            });
        }  
    );
};


local_resources.deleteJsonTable = function (database) {
    database.transaction(function (tx) {
      tx.executeSql('DROP TABLE ' + JSON_TABLE);
    });
};

local_resources.selectRows = function (database, query, callBack) { // <-- extra param
       var result = [];

       var errorHandler = function () {
            //console.log('Error while trying to select rows: ' + query + ' Database: ' + database)
       };

       database.transaction (function (tx) {
          tx.executeSql(query, [], function (tx, rs) {
             callBack(local_resources.recordSetToArray(rs)); // <-- new bit here
          }, errorHandler);
       });
    }; 

//TODO: Handle when 0 items found...index error probably..
local_resources.selectByName = function (database, name, callBack) { // <-- extra param
       var results = {};
       var query = "SELECT * FROM " + JSON_TABLE + " WHERE name = (?);";
       var errorHandler = function () {
            //console.log('Error while trying to selectByName: ' + query + ' Database: ' + database.name + ' Name: ' + name)
       };

       database.transaction(function (tx) {
          tx.executeSql(query, [name], function (tx, rs){
             callBack(rs.rows.item(0)); // <-- new bit here
          }, errorHandler);
       });
    }; 

local_resources.deleteByName = function (database, name, callback) {
        var results = {};
        results.name = name;
       var query = "DELETE FROM " + JSON_TABLE + " WHERE name = ?;";

       database.transaction(function (tx) {
          tx.executeSql(query, [name], function (tx){
            results.success = true;
             callback(results); // <-- new bit here
          }, function () {
            //console.log('Error while trying to Delete: ' + query + ' Database: ' + database.name + ' Name: ' + name)
            results.success = false;
            callback(results);
       });
   });
};

//TODO: Handle when 0 items found...index error probably..
local_resources.getJsonByName = function (database, name, callBack) { // <-- extra param
       var results = {};
       var query = "SELECT json FROM " + JSON_TABLE + " WHERE name = ?;";
       
       var errorHandler = function () {
            //console.log('Error while trying to selectByName: ' + query + ' Database: ' + database.name + ' Name: ' + name)
            callBack(false);
       };

       database.transaction(function (tx) {
          tx.executeSql(query, [name], function (tx, rs){
            rs = 
             callBack(JSON.parse(rs.rows.item(0).json)); // <-- new bit here
          }, errorHandler);
       });
    }; 

local_resources.getNameHashTable = function (database, callBack) { // <-- extra param
       var results = {};
       var query = "SELECT name,version FROM " + JSON_TABLE;
       var errorHandler = function () {
            //console.log('Error while trying to select rows: ' + query + ' Database: ' + database.name)
       };

       database.transaction(function (tx) {
          tx.executeSql(query, [], function (tx, rs){
             for(var i=0; i<rs.rows.length; i++) {
                var row = rs.rows.item(i);
                var name = row['name'];
                results[name] = row['version'];
             }
             //	console.log(results);
             callBack(results); // <-- new bit here
          }, errorHandler);
       });
    }; 

local_resources.recordSetToArray = function (recordSet) {
    var results = [];
    for(var i=0; i<recordSet.rows.length; i++) {
        results[i] = recordSet.rows.item(i);
     }
     return results;
};






