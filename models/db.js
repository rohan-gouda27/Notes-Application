const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rohan@127',
  database: 'notes_app'
});

connection.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});

module.exports = connection;
