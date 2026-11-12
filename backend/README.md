# Back-end Django — Nova Vida Pendotiba

Parte em **Python + Django** do sistema. O site (React/TypeScript, feito no Lovable)
fica na raiz do repositório; esta pasta `backend/` é o back-end Django com o mesmo
modelo de dados do trabalho (modelo lógico):

| Tabela             | O que guarda                                         |
|--------------------|------------------------------------------------------|
| `usuario`          | Quem usa a área reservada (pastor, diácono, secretaria) |
| `bairro`           | Bairros atendidos (filtro da tela Pessoas)           |
| `pessoa`           | Pessoas atendidas/acompanhadas                       |
| `tipo_atendimento` | Cesta básica, aconselhamento, visita...              |
| `atendimento`      | Histórico: quem foi atendido, como, quando e por quem |
| `evento`           | Agenda de eventos da igreja                          |

O que já vem pronto:

- **Área reservada** em `/admin/`: login, cadastrar/editar/excluir pessoas,
  atendimentos e eventos, busca por nome, filtro por bairro/status/tipo/data,
  histórico de atendimentos dentro da ficha da pessoa.
- **API JSON** (exige login): `/api/resumo/` (números para relatórios) e
  `/api/pessoas/?q=nome&bairro=Pendotiba`.
- **Banco**: SQLite para testar rápido; PostgreSQL com Docker ou na hospedagem
  (variável `DATABASE_URL`).

## Rodar no VS Code (sem Docker, mais simples)

Precisa do Python 3.11 ou mais novo. No terminal do VS Code, dentro da pasta `backend`:

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
python manage.py makemigrations cadastro
python manage.py migrate
python manage.py popular_dados
python manage.py createsuperuser
python manage.py runserver
```

Abra http://127.0.0.1:8000 e entre com o usuário criado no `createsuperuser`.
Sem `DATABASE_URL`, o banco é o arquivo `db.sqlite3`.

## Rodar com Docker + PostgreSQL

Dentro da pasta `backend`:

```bash
docker compose up --build
```

Em outro terminal, crie o usuário de acesso:

```bash
docker compose exec web python manage.py createsuperuser
```

Abra http://localhost:8000. O PostgreSQL roda no container `db`
(banco `novavida`, usuário `novavida`, senha `novavida`).

## Usar MySQL em vez de PostgreSQL

Instale `mysqlclient` (`pip install mysqlclient`) e use:

```
DATABASE_URL=mysql://usuario:senha@host:3306/novavida
```

O código dos models não muda.
