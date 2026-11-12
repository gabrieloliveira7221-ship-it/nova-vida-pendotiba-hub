# Arquitetura — Nova Vida Pendotiba

O sistema tem três camadas.

## 1. Interface (navegador)

Aplicação web em **React + TypeScript** (TanStack Start, Tailwind CSS), baseada no protótipo do
Figma validado com os responsáveis da igreja. Não precisa de instalação: é acessada pelo
navegador, no computador ou no celular.

- **Site público** (`src/routes/`): Início, Conheça-nos, Agenda, Ministérios e Contato.
- **Área reservada** (`src/routes/_authenticated/`): só abre com usuário logado; quem não está
  logado é redirecionado para a tela de Acesso.

## 2. Dados

Banco relacional **PostgreSQL** com as seis tabelas do modelo lógico:

| Tabela             | Conteúdo                                                   |
|--------------------|------------------------------------------------------------|
| `usuario`          | Quem usa a área reservada (nome, e-mail, cargo)            |
| `bairro`           | Bairros atendidos                                          |
| `pessoa`           | Pessoas atendidas pela igreja                              |
| `tipo_atendimento` | Cesta básica, aconselhamento, visita, oração, encaminhamento |
| `atendimento`      | Histórico: pessoa, tipo, data, situação e responsável      |
| `evento`           | Agenda da igreja                                           |

Regras importantes:

- **Segurança por linha (RLS):** todas as tabelas exigem usuário autenticado; visitantes não leem
  nem gravam dados pessoais.
- **Cadastro de usuário:** ao criar uma conta, um gatilho no banco cria a linha correspondente em
  `usuario`.
- **Agenda pública:** a página Agenda busca os eventos por uma função que roda no servidor e
  devolve apenas os campos públicos do evento (nome, data, horário, local e descrição).
- **Integridade:** chaves estrangeiras entre as tabelas; ao excluir uma pessoa, os atendimentos
  dela são excluídos junto; a situação do atendimento só aceita `agendado`, `realizado` ou
  `cancelado`.

O script do banco está em `docs/sql/Banco_Nova_Vida.original.sql` e as migrações aplicadas em
`drizzle/migrations/`.

## 3. Back-end em Python (Django)

A pasta `backend/` contém o back-end **Django** com o mesmo modelo de dados:

- `cadastro/models.py`: os models, com os mesmos nomes de tabelas e colunas do modelo lógico.
- `cadastro/admin.py`: área administrativa para cadastrar, editar, excluir, buscar e filtrar
  pessoas, atendimentos e eventos, com o histórico dentro da ficha da pessoa.
- `cadastro/views.py`: API em JSON (`/api/resumo/` e `/api/pessoas/`) para relatórios e consultas.
- `docker-compose.yml`: sobe o Django com um PostgreSQL em containers, para rodar igual em
  qualquer computador.

Instruções em `backend/README.md`.
