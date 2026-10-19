# Mecânica SAEP

Sistema web de uma oficina mecânica. Cadastra clientes, veículos e agendamentos. A tela é React. A API é Node.js com Express. O banco é PostgreSQL, acessado pelo Prisma ORM 7.9.1.

## Como rodar

1. Crie o banco `treino_db` no PostgreSQL.
2. Copie `.env.example` para `.env`. O padrão é usuário `postgres` e senha `admin`, em `localhost:5432`.
3. Na raiz do projeto, rode `npm install`.
4. Rode `npm run db:push` e depois `npm run db:seed`.
5. Rode `npm run dev`.
6. Abra http://localhost:3000.
7. Login da aula: `admin` / `123456`.

## O que tem em cada arquivo

| Caminho | O que é |
| --- | --- |
| `package.json` | Dependências e os scripts `npm run dev`, `db:push` e `db:seed`. |
| `package-lock.json` | Versões exatas das dependências instaladas. |
| `.env.example` | Modelo do endereço do banco. A cópia usada de verdade é o `.env`. |
| `.gitignore` | Pastas e arquivos que não entram no Git. |
| `prisma.config.ts` | Configuração do Prisma 7: caminho do schema e endereço do banco. |
| `prisma/schema.prisma` | Tabelas `usuario`, `cliente`, `veiculo` e `agendamento`. |
| `prisma/seed.js` | Insere o login da aula e os dados de exemplo. |
| `prisma.js` | Cria o Prisma Client com o adapter do PostgreSQL. |
| `servidor.js` | API na porta 3000: login e cadastro de clientes, veículos e agendamentos. No desenvolvimento também serve o React. |
| `index.html` | Página em que o React entra. |
| `vite.config.js` | Configuração do Vite, que monta a tela. |
| `src/main.jsx` | Inicia o React. |
| `src/App.jsx` | Rotas: início, login, clientes, veículos e agendamentos. |
| `src/Layout.jsx` | Menu das páginas. |
| `src/api.js` | Função que chama a API. |
| `src/estilo.css` | Estilo das páginas. |
| `src/paginas/Login.jsx` | Tela de login. |
| `src/paginas/Inicio.jsx` | Página inicial depois do login. |
| `src/paginas/Clientes.jsx` | Tela de clientes. |
| `src/paginas/Veiculos.jsx` | Tela de veículos (cada veículo pertence a um cliente). |
| `src/paginas/Agendamentos.jsx` | Tela de agendamentos (cada agendamento pertence a um veículo). |

`npm install` gera `node_modules/` e o Prisma Client em `generated/`. `npm run build` gera `dist/`. O `.env` fica só na máquina. Essas pastas e o arquivo não entram no Git.
