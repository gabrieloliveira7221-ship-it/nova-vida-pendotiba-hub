# Banco de dados — Nova Vida Pendotiba

`Banco_Nova_Vida.original.sql` é o script do banco conforme o modelo lógico do trabalho:
seis tabelas, chaves, regras de segurança (RLS) e dados iniciais.

## Ajustes na implantação

- `usuario.id_usuario` é um UUID igual ao identificador da conta de login. A ligação com a conta
  é feita por um gatilho que cria a linha em `usuario` no cadastro (migração
  `0001_criar_usuario_ao_cadastrar_conta.sql`), em vez de uma chave estrangeira direta para a
  tabela interna de autenticação.
- Cada tabela recebeu permissões explícitas de leitura e escrita para usuários autenticados.
  Visitantes sem login não têm acesso às tabelas.
- As sete regras de acesso (policies) do script foram mantidas, com RLS ativo nas seis tabelas.
- `cargo` é apenas descritivo e não dá permissões extras.

## Dados iniciais

Seis bairros (Pendotiba, Largo da Batalha, Maceió, Badu, Sapê e Matapaca) e cinco tipos de
atendimento (Cesta básica, Aconselhamento, Visita, Oração e Encaminhamento).

## Observação de segurança

Hoje qualquer usuário logado pode ler e alterar pessoas, atendimentos e eventos. Antes de usar
com dados reais, a igreja deve definir quem pode criar contas e, se necessário, separar
permissões por cargo.

## Verificação

`tests/database/modelo.sql` contém consultas que conferem as regras do modelo. Executadas no
banco, todas devem retornar verdadeiro.
