const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.MYSQL_CONFIG);
// Connect
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected as id ' + connection.threadId);
});
// End if Interrupted
process.on('SIGINT', () => {
    connection.end((err) => {
      if (err) {
        console.error('Error closing connection:', err.stack);
      } else {
        console.log('Connection closed.');
      }
      process.exit(0);
    });
});
module.exports = connection;

// More Encapsulated
const dbQuery = connection.query;
module.exports = dbQuery;

