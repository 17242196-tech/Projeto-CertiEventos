// server.js
const express = require('express');
const sql = require('mssql');
const { getConnection } = require('./dbConnection');
const participantesFacade = require('./participantesFacade');
const path = require('path');

const app = express();
app.use(express.json());

// ---------------- CONFIG FRONTEND ---------------- //
// Servir todos os arquivos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------- ROTAS API ---------------- //

// 1) Eventos
app.get('/eventos', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id, titulo, palestrante, descricao, carga_horaria_horas, modalidade, valor_inscricao, 
             data_inicio_inscricao, data_fim_inscricao, status 
      FROM dbo.eventos
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ mensagem: 'Erro ao listar eventos', detalhe: error.message });
  }
});

// 2) Participantes
app.get('/participantes', async (req, res) => {
  try {
    const result = await participantesFacade.listarParticipantes();
    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao listar participantes:', error);
    res.status(500).send('Erro ao listar participantes');
  }
});

app.post('/participantes', async (req, res) => {
  try {
    await participantesFacade.adicionarParticipante(req.body);
    res.send('Participante adicionado com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar participante:', error);
    res.status(500).send('Erro ao adicionar participante');
  }
});

app.put('/participantes/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    const { endereco } = req.body;
    await participantesFacade.atualizarEndereco(cpf, endereco);
    res.send('Endereço atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar participante:', error);
    res.status(500).send('Erro ao atualizar participante');
  }
});

app.delete('/participantes/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    await participantesFacade.removerParticipante(cpf);
    res.send('Participante removido com sucesso!');
  } catch (error) {
    console.error('Erro ao remover participante:', error);
    res.status(500).send('Erro ao remover participante');
  }
});

// 3) Certificados
app.get('/certificados', async (req, res) => {
  const { email } = req.query;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM dbo.certificados WHERE email = @email');
    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar certificados:', error);
    res.status(500).send('Erro ao buscar certificados');
  }
});

app.post('/certificados', async (req, res) => {
  const { codigo, email, evento_id } = req.body;
  try {
    const pool = await getConnection();
    await pool.request()
      .input('codigo', sql.VarChar, codigo)
      .input('email', sql.VarChar, email)
      .input('evento_id', sql.Int, evento_id)
      .query(`
        INSERT INTO dbo.certificados (codigo, email, evento_id, emitido_em)
        VALUES (@codigo, @email, @evento_id, GETDATE())
      `);
    res.send('Certificado criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar certificado:', error);
    res.status(500).send('Erro ao criar certificado');
  }
});

app.get('/certificados/validar', async (req, res) => {
  const { codigo } = req.query;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('codigo', sql.VarChar, codigo)
      .query('SELECT * FROM dbo.certificados WHERE codigo = @codigo');
    if (result.recordset.length > 0) {
      res.json({ valido: true, certificadoId: result.recordset[0].id });
    } else {
      res.json({ valido: false });
    }
  } catch (error) {
    console.error('Erro ao validar certificado:', error);
    res.status(500).send('Erro ao validar certificado');
  }
});

app.get('/certificados/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM dbo.certificados WHERE id = @id');
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send('Certificado não encontrado');
    }
  } catch (error) {
    console.error('Erro ao emitir certificado:', error);
    res.status(500).send('Erro ao emitir certificado');
  }
});

// ---------------- ROTAS FRONTEND AMIGAS ---------------- //
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/page-3-cadUsuario.html'));
});

// ---------------- INICIAR SERVIDOR ---------------- //
app.listen(3000, () => {
  console.log('🚀 API + Front rodando em http://localhost:3000');
});
