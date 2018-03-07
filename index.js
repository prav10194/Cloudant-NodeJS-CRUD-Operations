require('dotenv').config()
var Cloudant = require('cloudant');

var username = process.env.cloudant_username;
var password = process.env.cloudant_password;
console.log("process.env.cloudant_username",process.env.cloudant_username);
var cloudant = Cloudant({account:username, password:password});


var listAllDatabases = function(){
  cloudant.db.list(function(err, allDbs) {
    console.log('All my databases: %s', allDbs.join(', '))
  });
}

db = cloudant.db.use("users");

var getAllDocuments = function(){
  var promise = new Promise(function(resolve, reject){
    db.list(function (err, data) {
      data.rows.forEach(function(object){
        console.log("\nDocument ID: ",object.id,"\n");
      });
      resolve(data);
    });
  })
  return promise;
}

var readAllDocuments = function(){
  getAllDocuments().then(function(data){
    data.rows.forEach(function(object){
      db.get(object.id, function(err, docContent) {
        console.log("\nReading document: ",object.id,"\n");
        console.log(docContent)
      });
    });
  });
}

var queryDocuments = function(field, value){
  var query = {
    "selector": {
    }
  };
  query.selector[field] = value

  db.find(query, function(err, data) {
    for (var i = 0; i < data.docs.length; i++) {
      console.log('  Doc id: %s', JSON.stringify(data.docs[i]));
    }

  });

}

var deleteDocument = function(id){

  var query = {
    "selector": {
      "_id" : id
    }
  };

  db.find(query, function(err, data) {
    if(data.docs.length > 0){
      db.destroy(data.docs[0]._id, data.docs[0]._rev, function(err, body, header) {
        if (!err) {
          console.log("Successfully deleted doc", data.docs[0]._id);
        }
        else {
          console.log("err",err)
        }
      });
    }
    else{
      console.log("Document with id: ", id, " not found. ");
    }

  });

}

// The functions are not synchronized. Try one at a time and comment out others to see it's working.

/*
List all databases in the cloudant account.
*/

listAllDatabases()

/*
Get ids of all documents you have.
*/

getAllDocuments()

/*
Get information of all documents.
*/

readAllDocuments()

/*
Query the documents on some parameter.
*/

queryDocuments(field="occupation",value="engineer")

/*
Delete a document based on an id.
*/

deleteDocument("a403a36a9d37b64210c0cf2d794dacc1")
