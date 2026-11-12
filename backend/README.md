# Sistema Nova Vida Pendotiba (Django)

Aplicação web em **Python + Django** com banco **PostgreSQL**, empacotada com **Docker**.

## Funcionalidades

**Área pública** (sem login)

- `/` — agenda com os próximos eventos da igreja
- `/solicitar-atendimento/` — a pessoa pede um atendimento; o pedido entra como *Solicitado*

**Área de gestão** (exige login em `/entrar/`)

- Visão geral com totais, últimos atendimentos e próximos eventos
- Pessoas: cadastrar, editar, excluir, buscar por nome, filtrar por bairro e ver o histórico
- Atendimentos: registrar, editar, aceitar solicitação, marcar como realizado, cancelar e excluir;
  busca por pessoa e filtros por tipo, situação e data
- Eventos: criar, editar, consultar e excluir
- Relatórios: atendimentos por mês, tipo e situação; pessoas por bairro

A administração do Django (`/admin/`) é usada para criar os usuários da equipe e manter as
tabelas de apoio (bairros e tipos de atendimento).

## Estrutura

```
novavida/            configurações do projeto (settings, urls, wsgi)
cadastro/
  models.py          tabelas do modelo lógico
  forms.py           formulários
  views.py           regras de cada tela
  urls.py            rotas
  templates/         telas em HTML
  static/            CSS
  migrations/        criação das tabelas
  tests.py           testes automatizados
  management/        comandos popular_dados e garantir_admin
```

## Rodar com Docker

```bash
docker compose up --build
```

Acesse http://localhost:8000 e entre com usuário `admin` e senha `admin12345`
(definidos no `docker-compose.yml`).

## Rodar sem Docker (VS Code)

Precisa do Python 3.11 ou mais novo. Dentro da pasta `backend`:

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # Linux/Mac

pip install -r requirements.txt
python manage.py migrate
python manage.py popular_dados
python manage.py createsuperuser
python manage.py runserver
```

Sem a variável `DATABASE_URL`, o banco é um arquivo SQLite local (`db.sqlite3`).

## Testes

```bash
python manage.py test
```

## Hospedagem

O arquivo `render.yaml` na raiz do repositório cria no Render o serviço web (a partir do
`Dockerfile`) e o banco PostgreSQL. Ao iniciar, o contêiner aplica as migrações, cadastra
bairros e tipos de atendimento e cria o administrador definido em `ADMIN_USUARIO` e
`ADMIN_SENHA`.
