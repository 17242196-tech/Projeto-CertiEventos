# CERTIEVENTOS

## 📌 Resumo
O **CERTIEVENTOS** é um sistema de gestão de eventos acadêmicos e profissionais (seminários, workshops, palestras e congressos).  
O objetivo é permitir o **cadastro de participantes**, a **listagem de eventos**, além da **emissão e validação de certificados** de forma prática e integrada.

---

## 🛠️ Tecnologias Usadas
- **Node.js** + **Express** para o back-end.
- **SQL Server** como banco de dados relacional.
- **Padrões de Projeto** aplicados:
  - **Singleton** → garante uma única conexão com o banco.
  - **Facade** → encapsula a lógica de acesso ao banco e expõe métodos simples ao servidor.
  - Insomnia → utilizado para testar as rotas da API (ex.: cadastro de participantes, listagem de eventos).

---

## ✅ Requisitos Funcionais Implementados
- [x] Cadastro de participantes (CRUD completo: criar, listar, atualizar, remover).
- [x] Listagem de eventos disponíveis.
- [x] Emissão de certificados vinculados a eventos.
- [x] Validação de certificados por código.
- [x] Rotas amigáveis para acesso ao frontend (ex.: `/cadastro`).

---

## 🚀 Como Executar
1. Clone o repositório:
git clone https://github.com/17242196-tech/Projeto-CertiEventos.git

