// participantesFacade.js
const sql = require('mssql');
const { getConnection } = require('./dbConnection');

// Listar todos os participantes
async function listarParticipantes() {
  const pool = await getConnection();
  return pool.request().query(`
    SELECT id, nome_completo, email, cpf, rg, endereco, telefone, evento_id
    FROM dbo.participantes
  `);
}

// Adicionar participante
async function adicionarParticipante(dados) {
  const pool = await getConnection();
  return pool.request()
    .input('nome_completo', sql.VarChar, dados.nome_completo)
    .input('email', sql.VarChar, dados.email)
    .input('cpf', sql.VarChar, dados.cpf)
    .input('rg', sql.VarChar, dados.rg)
    .input('endereco', sql.VarChar, dados.endereco)
    .input('telefone', sql.VarChar, dados.telefone)
    .input('evento_id', sql.Int, dados.evento_id)
    .query(`
      INSERT INTO dbo.participantes (nome_completo, email, cpf, rg, endereco, telefone, evento_id)
      VALUES (@nome_completo, @email, @cpf, @rg, @endereco, @telefone, @evento_id)
    `);
}

// Atualizar endereço pelo CPF
async function atualizarEndereco(cpf, endereco) {
  const pool = await getConnection();
  return pool.request()
    .input('cpf', sql.VarChar, cpf)
    .input('endereco', sql.VarChar, endereco)
    .query('UPDATE dbo.participantes SET endereco = @endereco WHERE cpf = @cpf');
}

// Remover participante pelo CPF
async function removerParticipante(cpf) {
  const pool = await getConnection();
  return pool.request()
    .input('cpf', sql.VarChar, cpf)
    .query('DELETE FROM dbo.participantes WHERE cpf = @cpf');
}

module.exports = {
  listarParticipantes,
  adicionarParticipante,
  atualizarEndereco,
  removerParticipante
};
