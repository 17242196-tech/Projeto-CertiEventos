// server.js
const express = require('express');
const sql = require('mssql');
const { getConnection } = require('./dbConnection');
const participantesFacade = require('./participantesFacade');
const path = require('path');

const app = express();
app.use(express.json());

// ---------------- CONFIG FRONTEND ---------------- //
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
    res.status(500).json({ mensagem: 'Erro ao listar participantes', detalhe: error.message });
  }
});

app.post('/participantes', async (req, res) => {
  try {
    await participantesFacade.adicionarParticipante(req.body);
    res.status(201).json({ mensagem: 'Participante adicionado com sucesso!' });
  } catch (error) {
    console.error('Erro ao adicionar participante:', error);
    res.status(500).json({ mensagem: 'Erro ao adicionar participante', detalhe: error.message });
  }
});

app.put('/participantes/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    const { endereco } = req.body;
    await participantesFacade.atualizarEndereco(cpf, endereco);
    res.json({ mensagem: 'Endereço atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar participante:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar participante', detalhe: error.message });
  }
});

app.delete('/participantes/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    await participantesFacade.removerParticipante(cpf);
    res.json({ mensagem: 'Participante removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover participante:', error);
    res.status(500).json({ mensagem: 'Erro ao remover participante', detalhe: error.message });
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
    res.status(500).json({ mensagem: 'Erro ao buscar certificados', detalhe: error.message });
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
    res.status(201).json({ mensagem: 'Certificado criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar certificado:', error);
    res.status(500).json({ mensagem: 'Erro ao criar certificado', detalhe: error.message });
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
    res.status(500).json({ mensagem: 'Erro ao validar certificado', detalhe: error.message });
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
      res.status(404).json({ mensagem: 'Certificado não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao emitir certificado:', error);
    res.status(500).json({ mensagem: 'Erro ao emitir certificado', detalhe: error.message });
  }
});

// 4) Login Administrativo
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM dbo.administradores WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(401).json({ mensagem: 'Login inválido' });
    }

    const admin = result.recordset[0];

    if (senha !== admin.senha_hash) {
      return res.status(401).json({ mensagem: 'Login inválido' });
    }

    res.json({ mensagem: 'Login realizado com sucesso!', admin });
  } catch (error) {
    console.error('Erro ao validar login:', error);
    res.status(500).json({ mensagem: 'Erro no servidor', detalhe: error.message });
  }
});

// 5) Inscrições (JOIN participantes + eventos)
app.get('/inscricoes', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT p.id, p.nome_completo, p.email, e.titulo AS evento
      FROM dbo.participantes p
      JOIN dbo.eventos e ON p.evento_id = e.id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao listar inscrições:', error);
    res.status(500).json({ mensagem: 'Erro ao listar inscrições', detalhe: error.message });
  }
});

// ---------------- ROTAS FRONTEND AMIGAS ---------------- //
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/page-3-cadUsuario.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/admin_login.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/page-admin-dashboard.html'));
});

// ---------------- INICIAR SERVIDOR ---------------- //
app.listen(3000, () => {
  console.log('🚀 API + Front rodando em http://localhost:3000');
});
