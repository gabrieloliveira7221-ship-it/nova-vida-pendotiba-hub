# Nova Vida Pendotiba

sistema web da **Igreja Nova Vida Pendotiba** (Niterói – RJ), feito pro projeto de extensão do
curso de sistemas de informação da unilasalle-rj. sim, a gente fez um sistema pra igreja e tá
rodando de verdade, sem caô

o rolê era o seguinte: a igreja anotava pessoas, atendimentos sociais e eventos tudo na mão, e
ninguém sabia quem já tinha sido atendido. aí a gente digitalizou tudo e agora fica o histórico
de cada pessoa salvinho no banco

**bora ver o sistema:** https://nova-vida-pendotiba.onrender.com
(tá no plano grátis, então se ele tiver dormindo leva uns 50 segundinhos pra acordar, paciência)

## o que dá pra fazer

**parte aberta (geral vê)**
- agenda com os próximos eventos da igreja
- formulário pra pessoa **solicitar atendimento** — o pedido cai direto pra equipe como "solicitado"

**área de gestão (só entra quem tem login, nada de xereta)**
- **visão geral:** total de pessoas, atendimentos do mês, solicitações esperando e próximos eventos
- **pessoas:** cadastra, edita, apaga, busca pelo nome e filtra por bairro
- **histórico:** todos os atendimentos de cada pessoa — quem foi atendido, como, quando e por quem
- **atendimentos:** registra, edita, aceita solicitação, marca como realizado, cancela e apaga;
  busca por pessoa e filtra por tipo, situação e data
- **eventos:** cria, edita, consulta e apaga
- **relatórios:** atendimentos por mês, por tipo e por situação, e pessoas por bairro

## as tecnologias (a stack, né)

| camada         | o que a gente usou                                       |
|----------------|----------------------------------------------------------|
| interface      | html e css (templates do django), no visual do figma     |
| servidor       | python 3 + django                                        |
| banco de dados | postgresql                                               |
| ambiente       | docker (e docker compose pra rodar local)                |
| hospedagem     | render (serviço web + postgres), configurado no `render.yaml` |

## onde fica cada coisa

```
backend/                  o sistema em django
  novavida/               configurações do projeto
  cadastro/               models, forms, views, urls, templates, css e testes
  Dockerfile              imagem do sistema
  docker-compose.yml      sobe o sistema + postgres na tua máquina
render.yaml               receita da hospedagem no render
docs/                     arquitetura e script sql do banco
src/                      protótipo interativo em react, feito a partir do figma
```

## o banco

são seis tabelas: `usuario`, `bairro`, `pessoa`, `tipo_atendimento`, `atendimento` e `evento`.
os models tão em [`backend/cadastro/models.py`](backend/cadastro/models.py) e a arquitetura
explicada tá em [`docs/arquitetura.md`](docs/ARQUITETURA.md)

## como rodar na tua máquina

com docker (o jeito mais tranquilo):

```sh
cd backend
docker compose up --build
```

abre http://localhost:8000 e entra com `admin` / `admin12345`. sem docker, o passo a passo tá no
[`backend/readme.md`](backend/README.md)

pra rodar os testes:

```sh
cd backend
python manage.py test
```

## a equipe que fez acontecer

- joão gabriel de almeida corrêa
- miguel arcanjo da silva chaves
- gabriel oliveira lira
