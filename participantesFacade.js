// participantesFacade.js
const sql = require('mssql');
const { getConnection } = require('./dbConnection');

async function listarParticipantes() {
  const pool = await getConnection();
  return pool.request().query('SELECT * FROM participantes');
}

async function adicionarParticipante(dados) {
  const pool = await getConnection();
  return pool.request()
    .input('nome_completo', sql.VarChar, dados.nome_completo)
    .input('email', sql.VarChar, dados.email)
    .input('cpf', sql.VarChar, dados.cpf)
    .input('rg', sql.VarChar, dados.rg)
    .input('endereco', sql.VarChar, dados.endereco)
    .input('telefone', sql.VarChar, dados.telefone)
    .query('INSERT INTO participantes (nome_completo, email, cpf, rg, endereco, telefone) VALUES (@nome_completo, @email, @cpf, @rg, @endereco, @telefone)');
}

async function atualizarEndereco(cpf, endereco) {
  const pool = await getConnection();
  return pool.request()
    .input('cpf', sql.VarChar, cpf)
    .input('endereco', sql.VarChar, endereco)
    .query('UPDATE participantes SET endereco = @endereco WHERE cpf = @cpf');
}

async function removerParticipante(cpf) {
  const pool = await getConnection();
  return pool.request()
    .input('cpf', sql.VarChar, cpf)
    .query('DELETE FROM participantes WHERE cpf = @cpf');
}

module.exports = {
  listarParticipantes,
  adicionarParticipante,
  atualizarEndereco,
  removerParticipante
};
