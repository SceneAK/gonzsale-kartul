const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.MYSQL_URI);
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


const execute = connection.execute;
const query = connection.query;
module.exports = {
  connection,
  execute,
  query
}
