// global variables
var db;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;
var counter = 0;
function del_cat(id) {
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM Catalog WHERE id=(?)", [id], nullHandler, errorHandler);
    }, errorHandler, successCallBack);

    $('#' + id).hide();
}
function create_catalog() {
    return 'CREATE TABLE IF NOT EXISTS Catalog(Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            ' prod    TEXT,  ' +
            ' bcode   TEXT,  ' +
            ' cat     TEXT,  ' +
            ' dop     TEXT,  ' +
            ' stored   TEXT,  ' +
            ' desc    TEXT' +
            ')';
}
function del_catalog() {
    $("lbl_error").html("");
    // default_values();
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM Catalog", [], nullHandler, errorHandler);
    }, errorHandler, successCallBack);

    // removeElement("Catlog");
}
function alert1(str)
{
    counter = counter + 1;
    // $('#lbl_error').html("<br>" + counter + ") " + str + "<br>" + $('#lbl_error').html());
    $('#lbl_error').html("<br>" + str);
}
// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
    alert1('Error: ' + error.message + ' code: ' + error.code);

}

// this is called when a successful transaction happens
function successCallBack() {
    alert1("Process complete successfully...");
}

function nullHandler() {}
;

// called when the application loads
function onDeviceReady() {
    $("lbl_error").html("");
    $("#item").focus();
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

    // getAllTablesFromDB(getResultSetFromTable);
    ListDBValues();
}

// list the values in the database to the screen using jquery to update the #lbl_Catalogues element
function ListDBValues() {
    // alert1('ListDBValues 1');
    // $('#lbl_Catalogues').html('');

    if (!window.openDatabase) {
        alert1('Databases are not supported in this browser.');
        return;
    }


    db.transaction(function (transaction) {
        transaction.executeSql("SELECT Id, prod, bcode, cat, dop, stored, desc FROM Catalog;",
                [],
                function (transaction, result) {
                    if (result != null && result.rows != null) {
                        processResultSet("Catalog", result);
                    }
                }, errorHandler);
    }, errorHandler, nullHandler);
    return;

}

// this is the function that puts values into the database using the values from the text boxes on the screen
function AddValueToDB() {
    // alert1('inside 1');
    if (!window.openDatabase) {
        alert1('Databases are not supported in this browser.');
        return;
    }

// this is the section that actually inserts the values into the Catalogue table
    db.transaction(function (transaction) {
        transaction.executeSql('INSERT INTO Catalog(prod, bcode, cat, dop, stored, desc) VALUES (?,?,?,?,?,?) ',
                [$('#item').val(),
                    $('#code').val(),
                    $('#category>option:selected').text(),
                    $('#dop').val(),
                    $('#store>option:selected').text(),
                    $('#desc').val()], nullHandler, errorHandler);
    }, errorHandler, successCallBack);
    
 alert1($('#item').val() + " - " +
                    $('#code').val() + " - " +
                    $('#category>option:selected').text() + " - " +
                    $('#dop').val() + " - " +
                    $('#store>option:selected').text() + " - " +
                    $('#desc').val());
// this calls the function that will show what is in the Catalogue table in the database
    // pr();
    default_values();
    ListDBValues();
    return false;

}
function default_values()
{
//    $('#item').val('#item ' + counter);
//    $('#code').val('#code ' + counter);
//    $('#category').val('Fruit');
//    $('#dop').val('05/15/2018');
//    $('#store').val('Saddar');
//    $('#desc').text('#desc ' + counter);
}

function processResultSet(tblname, results) {
    $("#tbl").html('');
    var len = results.rows.length;
    if (len == 0)
    {
        return;
    }
    var tbl = document.createElement('table');
    tbl.setAttribute("id","tbl") ;
    // var trTblName = document.createElement('tr');
    // var thTblName = document.createElement('th');
    // thTblName.innerHTML = tblname;
    // trTblName.colSpan = 7;
    // trTblName.setAttribute("font-size","20") ;
    // trTblName.appendChild(thTblName);
    // tbl.appendChild(trTblName);

    var trHeader = document.createElement('tr');
    var th1 = document.createElement('th');
    th1.innerHTML = '';
    var th2 = document.createElement('th');
    th2.innerHTML = 'Product';
    var th3 = document.createElement('th');
    th3.innerHTML = 'Code';
    var th4 = document.createElement('th');
    th4.innerHTML = 'Category';
    var th5 = document.createElement('th');
    th5.innerHTML = 'Purchase';
    var th6 = document.createElement('th');
    th6.innerHTML = 'Store';
    // var th7 = document.createElement('th');
    // th7.innerHTML = 'Description';
    trHeader.appendChild(th1);
    trHeader.appendChild(th2);
    trHeader.appendChild(th3);
    trHeader.appendChild(th4);
    trHeader.appendChild(th5);
    trHeader.appendChild(th6);
    // trHeader.appendChild(th7);
    tbl.appendChild(trHeader);

    for (var i = 0; i < len; i++) {
        var tr = document.createElement('tr');
        
        tr.setAttribute("id", results.rows[i].Id);
        var td0 = document.createElement('td');
        td0.innerHTML = '<a href="#" onClick=\'javascript: if (confirm("Delete the record Product: ' + results.rows[i].prod + '?")) { del_cat(' + results.rows[i].Id + ');}\'><img src="img/del1.png" width="40" height="40" border=0/></a>';
        
        // var td1 = document.createElement('td');
        // td1.innerHTML = results.rows[i].Id;
        
        var td2 = document.createElement('td');
        td2.innerHTML = results.rows[i].prod;
        var td3 = document.createElement('td');
        td3.innerHTML = results.rows[i].bcode;
        var td4 = document.createElement('td');
        td4.innerHTML = results.rows[i].cat;
        var td5 = document.createElement('td');
        td5.innerHTML = results.rows[i].dop;
        var td6 = document.createElement('td');
        td6.innerHTML = results.rows[i].stored;
        // var td7 = document.createElement('td');
        // td7.innerHTML = results.rows[i].desc;
        
        tr.appendChild(td0);
        // tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        // tr.appendChild(td7);
        
        tbl.appendChild(tr);
    }
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(document.createElement('hr'));
    body.appendChild(tbl);
}
/**
 * Comment
 */
function countRecord(transaction) {
    c = 0;
    transaction(function (tx) {
        tx.executeSql("SELECT COUNT(*) AS nor FROM " + table, [],
                function (tx, result) { // <-- this is where you forgot tx
                    c = result.rows;
                },
                function (tx, error) {
                    sql = create_catalog();
                    tx.executeSql(sql);
                }
        , nullHandler, errorHandler);
    }, errorHandler, successCallBack);
    return c;
}
function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}