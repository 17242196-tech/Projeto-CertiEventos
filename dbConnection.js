// dbConnection.js
const sql = require('mssql');
const config = require('./connection'); // usa o connection.js

let pool;

async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log('Conexão criada com sucesso!');
  }
  return pool;
}

module.exports = { getConnection };
