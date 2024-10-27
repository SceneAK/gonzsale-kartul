const mysql = require('mysql2/promise');

let connectionPromise = mysql.createConnection(process.env.MYSQL_URI);;

// SETUP CONNECTION
(async () => { 
  // Connect
  const connection = await connectionPromise;
  try {
    await connection.connect();
    console.log('Connected as id ' + connection.threadId)
  } catch (err) {
    console.log('Could not connect: ' + err);
  }
  
  // End if Interrupted 
  process.on('SIGINT',() => {
    try {
      connection.end().then( ()=> { console.log('Connection closed'); process.exit(0)});
    } catch (err) {
      console.error('Error closing connection:', err)
      process.exit(1);
    }
  });
})(); // call

module.exports = connectionPromise;
