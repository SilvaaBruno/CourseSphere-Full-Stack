# CourseSphere Full Stack

Este projeto consiste em uma plataforma de gestão de cursos e aulas, desenvolvida para o desafio técnico do V-LAB. A aplicação foi construída utilizando uma arquitetura full stack com separação clara entre o cliente (Frontend) e o servidor (Backend), permitindo o gerenciamento completo de conteúdos educacionais.

## Estrutura do Projeto

O repositório está dividido em duas pastas principais:
1. Backend: Desenvolvido em Python com o framework FastAPI. Utiliza o SQLAlchemy como ORM para gerenciar o banco de dados SQLite.
2. Frontend: Desenvolvido em React.js utilizando o Vite para construção do ambiente. A comunicação com o servidor é feita através da biblioteca Axios.

## Funcionalidades Implementadas

O sistema foi construído seguindo os requisitos obrigatórios do edital, focando na lógica de persistência e segurança:

* Autenticação: Sistema de registro de novos usuários e login. Os dados são verificados no banco de dados para garantir o acesso.
* Proteção de Rotas: Implementação de lógica no frontend para verificar a existência de uma sessão ativa (ID do usuário). Caso o usuário não esteja autenticado, ele é redirecionado automaticamente para a tela de login.
* Gestão de Cursos (CRUD): O usuário autenticado pode cadastrar novos cursos, visualizar a listagem completa e excluir cursos existentes.
* Gestão de Aulas (CRUD): Cada curso possui sua própria área de aulas, onde é possível adicionar novos conteúdos com títulos e links de vídeo, além de listar e remover aulas.
* Validação de Regras de Negócio: O formulário de criação de cursos impede o cadastro caso a data de término seja anterior à data de início, garantindo a integridade dos dados cronológicos.
* Filtro de Busca: No painel principal, existe um campo de busca que filtra os cursos em tempo real pelo nome, facilitando a navegação.
* Consumo de API Externa: Na visualização de aulas, o sistema consome a API pública randomuser.me para exibir dinamicamente um instrutor convidado para cada curso.

## Como Executar o Backend

Para rodar o servidor, é necessário ter o Python instalado. Siga os passos abaixo dentro da pasta backend:

1. Crie um ambiente virtual: python -m venv venv
2. Ative o ambiente virtual:
   - No Windows (PowerShell): .\venv\Scripts\activate
   - Caso a pasta seja 'bin' (Linux/Mac ou Git Bash): .\venv\bin\activate
   - Nota: Se houver erro de permissão no PowerShell, execute: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
3. Instale as dependências necessárias: pip install fastapi uvicorn sqlalchemy
4. Inicie o servidor: uvicorn main:app --reload

## Como Executar o Frontend

Para rodar o cliente, é necessário ter o Node.js instalado. Siga os passos abaixo dentro da pasta frontend:

1. Instale as dependências: npm install
2. Inicie a aplicação: npm run dev

## Dados para Teste

Caso o avaliador opte por não criar um novo registro, pode utilizar o seguinte usuário padrão para testar todas as funcionalidades:
* Email: teste@teste.com
* Senha: 123456