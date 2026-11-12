nova vida pendotiba

sistema web da igreja nova vida pendotiba (niterói – rj), feito pro projeto de extensão do curso de sistemas de informação da unilasalle-rj. sim, a gente fez um sistema pra igreja e tá rodando de verdade, sem caô

o rolê era o seguinte: a igreja anotava pessoas, atendimentos sociais e eventos tudo na mão, e ninguém sabia quem já tinha sido atendido. aí a gente digitalizou tudo e agora fica o histórico de cada pessoa salvinho no banco

bora ver: https://nova-vida-pendotiba-hub.lovable.app
o que dá pra fazer

site aberto (geral vê)

    páginas início, conheça-nos, agenda, ministérios e contato
    agenda puxando os próximos eventos direto do sistema, nada de evento fake
    formulário de contato que já abre o e-mail da igreja com a mensagem prontinha

área reservada (só entra quem tem login, nada de xereta)

    login e cadastro com e-mail e senha
    pessoas: cadastra, edita, apaga, busca pelo nome e filtra por bairro
    histórico: todos os atendimentos de cada pessoa — quem foi atendido, como, quando e por quem
    atendimentos: registra, edita, marca como realizado ou cancelado e apaga; filtra por pessoa, tipo, situação e data
    eventos: cria, edita, consulta e apaga
    visão geral e relatórios: números e gráficos saindo direto do banco, tudo real

as tecnologias (a stack, né)
camada 	o que a gente usou
interface 	react, typescript, tanstack start, tailwind css
banco de dados 	postgresql, com controle de acesso por linha (rls)
back-end 	python 3 + django (pasta backend/), com docker
onde fica cada coisa

src/
  routes/                 as páginas do site
    _authenticated/       área reservada (painel, pessoas, atendimentos, eventos, relatórios)
  components/             componentes visuais que todo mundo reusa
  lib/                    funçõezinhas de apoio (datas, usuário logado, agenda pública)
backend/                  back-end django (models, área administrativa, api)
docs/                     arquitetura e script sql do banco
drizzle/migrations/       migrações que já rodaram no banco

o banco

são seis tabelas: usuario, bairro, pessoa, tipo_atendimento, atendimento e evento. o script completinho tá em docs/sql/banco_nova_vida.original.sql e a arquitetura explicada tá em docs/arquitetura.md
como rodar na tua máquina

site

npm install
npm run dev

back-end django: dá uma olhada no backend/readme.md que tá tudo lá
a equipe que fez acontecer

    joão gabriel de almeida corrêa
    miguel arcanjo da silva chaves
    gabriel oliveira lira
