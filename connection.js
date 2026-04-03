const config = {
  user: 'app_user',                  // usuário do SQL Server
  password: 'App@2026#Conecta',      // senha do usuário
  server: 'localhost\\SQLEXPRESS',   // instância do SQL Server
  database: 'esuda_conecta',         // nome do banco
  options: {
    encrypt: false,                  // false para conexões locais
    trustServerCertificate: true     // necessário em alguns ambientes
  }
};

module.exports = config;
