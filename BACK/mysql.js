const mysql = require('mysql');

//BASE DE DONNEE
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'test123',
    database: 'groupomania'
  });
  db.connect(function(err) {

    if (err) throw err;
 
    console.log("Connecté à la base de données MySQL!");
 
  });

  module.exports = db;