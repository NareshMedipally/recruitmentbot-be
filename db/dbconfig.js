const mysql = require('mysql');

// var dbConnection = mysql.createPool({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'root@123',
//   database: 'a10mi6nt_recruit_bot'
// });

var dbConnection = mysql.createPool({
  host: '111.118.215.187',
  port: 3306,
  user: 'a10mi6nt_recruit',
  password: 'recruit@2020',
  database: 'a10mi6nt_recruit_bot'
});

dbConnection.getConnection(function(err) {
  if (err){ console.error('error connecting: ' + err);}
  console.log('connected!');
 
    return;
});

module.exports = dbConnection;