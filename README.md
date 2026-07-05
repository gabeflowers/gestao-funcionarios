# Cadastro de Funcionários — Grupo Dass

Aplicação web para gerenciar o cadastro de tamanhos de calçado e camiseta dos
funcionários, voltada à distribuição de brindes de fim de ano. Permite cadastrar,
editar, listar, buscar e excluir funcionários.

## Funcionalidades

- Cadastro e edição de funcionários (CPF, nome, email, tamanho de camiseta e de calçado).
- Exclusão de funcionários com confirmação.
- Listagem de todos os funcionários.
- Busca combinável por CPF, nome, email, tamanho de camiseta e tamanho de calçado.
- Validação nas duas camadas (front-end e back-end).
- Mensagens de feedback para cadastro, edição e exclusão.

## Stack

**Back-end:** Node.js + Express, PostgreSQL (driver `pg`).
**Front-end:** Vue 3 (Composition API, `<script setup>`) + Vite.
**Banco:** PostgreSQL rodando em contêiner Docker.

## Pré-requisitos

- Node.js **20.19+** ou **22+** (o Vite atual exige essa versão).
- Docker e Docker Compose (para subir o banco).
- npm (ou pnpm).

## Como rodar

Todos os comandos partem da raiz do projeto, salvo indicação.

### 1. Subir o banco de dados

```bash
docker compose up -d
```

Isso sobe um PostgreSQL em contêiner e cria o banco `employees`. O schema
(tabela `employees`) é aplicado automaticamente na primeira inicialização do
contêiner, a partir de `backend/schema.sql`.

### 2. Rodar o back-end

```bash
cd backend
npm install
npm run dev
```

A API sobe em `http://localhost:3000`.

### 3. Rodar o front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`. O Vite faz proxy das chamadas
`/api` para o back-end em `:3000`, então não é necessário configurar CORS
manualmente em desenvolvimento.

### 4. Acessar

Abra `http://localhost:5173` no navegador.

## Variáveis de ambiente

O back-end lê as variáveis de `backend/.env`. Crie o arquivo com base no
exemplo abaixo (um `.env.example` acompanha o repositório):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/employees
PORT=3000
```

O `DATABASE_URL` deve apontar para o banco definido no `docker-compose.yml`
(usuário, senha, host, porta e nome do banco). Se a porta 5432 já estiver
ocupada na sua máquina, altere o mapeamento no `docker-compose.yml` e a porta
no `DATABASE_URL` de forma correspondente.

## Estrutura do projeto

```
.
├─ docker-compose.yml         # sobe o PostgreSQL
├─ backend/
│  ├─ schema.sql              # definição da tabela employees
│  └─ src/
│     ├─ db/                  # pool de conexão com o Postgres
│     ├─ repositories/        # acesso ao banco (SQL parametrizado)
│     ├─ services/            # regra de negócio e validação
│     ├─ controllers/         # camada HTTP (req/res, status codes)
│     ├─ routes/              # mapeamento de rotas REST
│     ├─ middlewares/         # tratamento centralizado de erros
│     ├─ utils/               # validação de CPF (dígito verificador)
│     ├─ app.js               # configuração do Express
│     └─ server.js            # inicialização do servidor
└─ frontend/
   └─ src/
      ├─ services/            # camada de consumo da API
      ├─ views/               # EmployeeView (orquestrador de estado)
      └─ components/          # EmployeeForm, EmployeeTable, EmployeeSearch
```

O back-end segue uma arquitetura em camadas (`route → controller → service →
repository`), com responsabilidades separadas: o controller lida apenas com
HTTP, o service concentra regra e validação, e o repository conversa com o
banco.

## API

Base: `http://localhost:3000`

| Método | Rota              | Descrição                                   |
|--------|-------------------|---------------------------------------------|
| GET    | `/employees`      | Lista todos; aceita filtros de busca (query)|
| GET    | `/employees/:id`  | Retorna um funcionário                      |
| POST   | `/employees`      | Cria um funcionário                         |
| PUT    | `/employees/:id`  | Atualiza um funcionário                     |
| DELETE | `/employees/:id`  | Exclui um funcionário                       |

**Busca** (via query string em `GET /employees`), todos opcionais e combináveis:
`cpf`, `name`, `email`, `shirtSize`, `shoeSize`.
Exemplo: `GET /employees?name=ana&shirtSize=M`

**Corpo esperado** (POST/PUT), em camelCase:

```json
{
  "cpf": "11144477735",
  "name": "Ana Souza",
  "email": "ana@empresa.com",
  "shirtSize": "M",
  "shoeSize": 38
}
```

Regras de validação: CPF válido (11 dígitos com dígito verificador),
email bem formatado, tamanho de camiseta em `PP, P, M, G, GG, XG`,
tamanho de calçado inteiro entre 34 e 48.

**Códigos de status:** `201` (criado), `200` (sucesso), `204` (excluído),
`400` (validação), `404` (não encontrado), `409` (CPF ou email já cadastrado),
`500` (erro interno).

## Decisões técnicas

- **Driver `pg` em vez de ORM:** mais controle e transparência sobre o SQL
  gerado. Todas as queries usam parâmetros (`$1`, `$2`...), o que previne SQL
  injection — o valor do usuário nunca é concatenado na string SQL.
- **Validação em camadas:** no front-end para feedback rápido ao usuário (UX);
  no back-end como fonte da verdade (segurança); e no banco via constraints
  (`UNIQUE`, `CHECK`) como última linha de defesa.
- **Unicidade de CPF/email pela constraint do banco:** em vez de checar com um
  `SELECT` antes de inserir (sujeito a condição de corrida), a inserção confia
  na constraint `UNIQUE` e captura a violação, retornando `409`.
- **Docker apenas para o banco:** garante reprodutibilidade (subir o banco com
  um comando) sem a complexidade de containerizar a aplicação inteira. A API e
  o front rodam localmente com `npm`, mais simples de inspecionar.
- **Componentes Vue com fluxo unidirecional:** o estado vive na `EmployeeView`;
  os componentes recebem dados por props e comunicam ações por eventos
  (`props descem, eventos sobem`). O `EmployeeForm` é reutilizado para criar e
  editar.

## Próximos passos (fora do escopo deste teste)

Itens que não foram implementados por não fazerem parte do escopo, mas que
seriam necessários em produção:

- **Autenticação e autorização:** as rotas estão abertas. Em produção, com
  dados pessoais de RH, seriam protegidas por login (JWT) e controle de acesso,
  via um middleware anterior ao controller — sem alterar service ou repository.
- **Paginação na listagem** (`LIMIT`/`OFFSET`) para grandes volumes.
- **CORS restrito** a origens específicas, em vez de aberto.
- **Testes automatizados** das camadas de service e repository.
