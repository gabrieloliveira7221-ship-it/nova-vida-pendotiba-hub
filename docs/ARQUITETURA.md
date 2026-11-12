# Arquitetura — Nova Vida Pendotiba

O sistema é uma aplicação web em Python com três camadas, executada em contêiner Docker.

```
Navegador  ──HTTP──▶  Django (Python)  ──SQL──▶  PostgreSQL
 HTML/CSS             views, forms, ORM           6 tabelas
```

## 1. Interface

Telas em **HTML e CSS** geradas pelos templates do Django (`backend/cadastro/templates/`),
seguindo o protótipo do Figma validado com os responsáveis da igreja. O CSS
(`backend/cadastro/static/cadastro/estilo.css`) adapta o layout para computador e celular.
Não há instalação: o sistema é acessado pelo navegador.

- **Área pública:** agenda de eventos e formulário de solicitação de atendimento.
- **Área de gestão:** visão geral, pessoas, atendimentos, eventos e relatórios.

## 2. Servidor (Python + Django)

O Django recebe as requisições da interface e aplica as regras de negócio:

| Arquivo      | Responsabilidade                                                       |
|--------------|------------------------------------------------------------------------|
| `urls.py`    | Liga cada endereço à sua tela                                          |
| `views.py`   | Regras de cada tela: buscas, filtros, cadastro, edição, exclusão, relatórios |
| `forms.py`   | Validação dos dados digitados                                          |
| `models.py`  | Tabelas do banco, usadas pelo ORM do Django                            |
| `admin.py`   | Administração: usuários da equipe, bairros e tipos de atendimento     |
| `tests.py`   | Testes automatizados dos requisitos principais                         |

Regras importantes:

- **Acesso restrito:** toda a área de gestão exige login (`LoginRequiredMixin`); visitantes só
  veem a agenda e o formulário de solicitação. As senhas são guardadas com hash pelo Django.
- **Responsável:** ao registrar um atendimento ou aceitar uma solicitação, o usuário logado é
  gravado como responsável.
- **Histórico:** a ficha de cada pessoa lista todos os atendimentos dela, com tipo, data,
  responsável e situação.
- **Solicitações:** o pedido feito pelo site cria a pessoa (se ainda não existir) e um
  atendimento com situação *Solicitado*, que a equipe aceita, realiza ou cancela.

## 3. Dados (PostgreSQL)

| Tabela             | Conteúdo                                                        |
|--------------------|-----------------------------------------------------------------|
| `usuario`          | Equipe com acesso à gestão (nome, e-mail, cargo, senha)         |
| `bairro`           | Bairros atendidos                                               |
| `pessoa`           | Pessoas atendidas pela igreja                                   |
| `tipo_atendimento` | Cesta básica, aconselhamento, visita, oração, encaminhamento    |
| `atendimento`      | Pessoa, tipo, data, situação, descrição e responsável           |
| `evento`           | Nome, data, horário, local, descrição e presença prevista       |

As tabelas são criadas pelas migrações do Django (`backend/cadastro/migrations/`), com os
mesmos nomes de tabelas e colunas do modelo lógico. Excluir uma pessoa exclui os atendimentos
dela; bairros e tipos em uso não podem ser excluídos.

## 4. Docker e hospedagem

- `backend/Dockerfile` monta a imagem do sistema. Ao iniciar, o contêiner aplica as migrações,
  cadastra bairros e tipos de atendimento, garante o usuário administrador e sobe o servidor
  (Gunicorn).
- `backend/docker-compose.yml` sobe o sistema e um PostgreSQL na máquina local.
- `render.yaml` publica o mesmo contêiner no Render, com um banco PostgreSQL gerenciado.

## Protótipo interativo

A pasta `src/` contém um protótipo navegável em React, construído a partir das telas do Figma.
