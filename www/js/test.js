// global variables
var db;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;
var counter = 0;
function create_catalog() {
    return 'CREATE TABLE IF NOT EXISTS Catalogue(CatalogueId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            ' product    TEXT,  ' +
            ' code    TEXT,  ' +
            ' category TEXT,  ' +
            ' dop         TEXT,  ' +
            ' store         TEXT,  ' +
            ' desc         TEXT' +
            ')';
}
function alert1(str)
{
    counter = counter + 1;
    $('#lbl_error').html("<br>" + counter + ") " + str + "<br>" + $('#lbl_error').html());
}
// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
    alert1('Error: ' + error.message + ' code: ' + error.code);

}

// this is called when a successful transaction happens
function successCallBack() {
    alert1("DEBUGGING: success");

}

function nullHandler() {}
;

// called when the application loads
function onDeviceReady() {
    $("lbl_error").html("");
    default_values();
// This alert1 is used to make sure the application is loaded correctly
// you can comment this out once you have the application working
    //   alert1("DEBUGGING: we are in the onBodyLoad() function");
    sql = create_catalog();
    // alert1(sql);  
    if (!window.openDatabase) {
        // not all mobile devices support databases  if it does not, the following alert1 will display
        // indicating the device will not be albe to run this application
        alert1('Databases are not supported in this browser.');
        return;
    }

// this line tries to open the database base locally on the device
// if it does not exist, it will create it and return a database object stored in variable db
    db = openDatabase(shortName, version, displayName, maxSize);


// this line will try to create the table Catalogue in the database just created/openned
    db.transaction(function (tx) {
        // you can uncomment this next line if you want the Catalogue table to be empty each time the application runs
        // tx.executeSql( 'DROP TABLE Catalogue',nullHandler,nullHandler);
        tx.executeSql(sql, [], nullHandler, errorHandler);
    }, errorHandler, successCallBack);
    sql = 'INSERT INTO Catalogue(CatalogueId, product, code, category, dop, store, desc) VALUES ' +
            '(1, "item", "code", "category", "dop", "store", "desc")';
    alert1(sql);
// this is the section that actually inserts the values into the Catalogue table
    db.transaction(function (transaction) {
        transaction.executeSql(sql, nullHandler, errorHandler);
    });

    ListDBValues();
}

// list the values in the database to the screen using jquery to update the #lbl_Catalogues element
function ListDBValues() {
    alert1('ListDBValues 1');
    // $('#lbl_Catalogues').html('');

    if (!window.openDatabase) {
        alert1('Databases are not supported in this browser.');
        return;
    }

// this line clears out any content in the #lbl_Catalogues element on the page so that the next few lines will show updated
// content and not just keep repeating lines

    alert1('countRecord: ' + countRecord('Catalogue'));
// this next section will select all the content from the Catalogue table and then go through it row by row
// appending the CatalogueId  FirstName  LastName to the  #lbl_Catalogues element on the page
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT CatalogueId, product, code, category, dop, store, desc FROM Catalogue;', [],
                function (transaction, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            $('#lbl_Catalogues').append(
                                    row.CatalogueId + ' - ' +
                                    row.product + ' ' +
                                    row.code + ' ' +
                                    row.category + ' ' +
                                    row.dop + ' ' +
                                    row.store + ' ' +
                                    row.desc);
                        }
                    }
                }, errorHandler);
    }, errorHandler, nullHandler);

    return;

}

// this is the function that puts values into the database using the values from the text boxes on the screen
function AddValueToDB() {
    alert1('inside 1');
    if (!window.openDatabase) {
        alert1('Databases are not supported in this browser.');
        return;
    }
    alert1('inside 2');
    sql = 'INSERT INTO Catalogue(product, code, category, dop, store, desc) VALUES (?,?,?,?,?,?),' +
            '[' + $('#item').val() + ', ' +
            $('#code').val() + ', ' +
            $('#category').val() + ', ' +
            $('#dop').val() + ', ' +
            $('#store').val() + ', ' +
            $('#desc').val() + ']';
    alert1(sql);
// this is the section that actually inserts the values into the Catalogue table
    db.transaction(function (transaction) {
        transaction.executeSql(sql, nullHandler, errorHandler);
    });
    alert1('inside 3');
// this calls the function that will show what is in the Catalogue table in the database
    ListDBValues();

    return false;

}
function default_values()
{
    $('#item').val('#item ' + counter);
    $('#code').val('#code ' + counter);
    $('#category').val('Fruit');
    $('#dop').val('05/15/2018');
    $('#store').val('Saddar');
    $('#desc').text('#desc ' + counter);
}

function getAllTablesFromDB(callback) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT Catalogue from ' + shortName + ' WHERE type = "table"', [], function (tx, results) {
            callback(results, processResultSet);
        });
    });
}

function getResultSetFromTable(results, callback) {
    var length = results.rows.length;
    var j = 0;
    for (var i = 0; i < length; i++) {
        db.transaction(function (tx) {
            var k = 0, tblname = results.rows[j++].tbl_name;
            tx.executeSql('SELECT * FROM ' + tblname, [], function (tx, results) {
                callback(tblname, results);
            });
        });
    }

}

function processResultSet(tblname, results) {
    console.log('----------------------' + tblname)
    var len = results.rows.length;
    var tbl = document.createElement('table');
    var trTblName = document.createElement('tr');
    var thTblName = document.createElement('th');
    thTblName.innerHTML = tblname;
    trTblName.colSpan = 2;
    trTblName.appendChild(thTblName);
    tbl.appendChild(trTblName);

    var trHeader = document.createElement('tr');
    var th1 = document.createElement('th');
    th1.innerHTML = 'id';
    var th2 = document.createElement('th');
    th2.innerHTML = 'name';
    trHeader.appendChild(th1);
    trHeader.appendChild(th2);
    tbl.appendChild(trHeader);

    for (var i = 0; i < len; i++) {
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.innerHTML = results.rows[i].id;
        var td2 = document.createElement('td');
        td2.innerHTML = results.rows[i].name;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbl.appendChild(tr);
    }
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(tbl);
    body.appendChild(document.createElement('hr'));
}
/**
 * Comment
 */
function countRecord(table) {
    c = 0;
    db.transaction(function (tx) {
        tx.executeSql("SELECT COUNT(*) AS nor FROM " + table, [],
                function (tx, result) { // <-- this is where you forgot tx
                    c = result.rows;
                },
                function (tx, error) {
                    sql = create_catalog();
                    tx.executeSql(sql);
                }
        );
    });
    return c;
}