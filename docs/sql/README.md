# Banco Nova Vida — Lovable Cloud

O arquivo `Banco_Nova_Vida.original.sql` preserva exatamente o material enviado.
O banco Cloud contém as seis tabelas e todas as colunas desse modelo.

## Adaptações aprovadas

- `usuario.id_usuario` continua UUID e chave primária, sem a referência direta a `auth.users` nem seu efeito de exclusão em cascata. As cinco outras chaves estrangeiras permanecem intactas.
- Foram acrescentadas permissões explícitas de leitura e escrita para `authenticated` e permissões completas para `service_role`, em cada tabela. Não foi concedido acesso a `anon`.
- Todas as sete policies originais foram preservadas; RLS está ativo nas seis tabelas.
- `cargo` é informação descritiva, não uma fonte de autorização: o próprio usuário pode alterá-lo conforme a policy original.

## Dados iniciais

Foram inseridos os seis bairros e cinco tipos de atendimento exatamente como enviados, separadamente da criação do esquema, conforme o fluxo do Cloud. Nenhuma pessoa, conta, evento ou atendimento foi inventado.

## Limites desta entrega

As páginas de gestão continuam demonstrativas; não foram conectadas ao banco nem foi implementado acesso real nesta solicitação.
As policies fornecidas permitem a qualquer conta autenticada ler e alterar bairros, tipos, pessoas, atendimentos e eventos, e ler todos os perfis. Antes de cadastrar informações reais ou sensíveis, deve-se revisar esse acesso com a igreja.

## Verificação

`tests/database/modelo.sql` contém verificações de leitura para as principais regras do modelo e pode ser executado contra o banco Cloud. Cada resultado deve ser verdadeiro.