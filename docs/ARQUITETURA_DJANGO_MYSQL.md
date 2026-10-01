# Arquitetura acadêmica — Nova Vida Pendotiba

Este protótipo apresenta a interface e os fluxos do sistema. A implementação acadêmica final será feita em **Python 3.11, Django 4.2, MySQL 8 e Docker**.

## Módulos Django sugeridos

- `contas`: autenticação por celular, perfis e permissões.
- `pessoas`: membros, visitantes, contatos e número de membro.
- `atendimentos`: registros sociais e histórico de acompanhamento.
- `eventos`: agenda, inscrições e presença.
- `site`: páginas públicas, agenda publicada e formulário de contato.
- `relatorios`: indicadores de participação e atendimentos.

## Entidades principais

### Perfil
- usuário do Django (chave estrangeira)
- nome completo
- celular único
- número de membro único (`NV-AAAA-NNNN`)
- função: administrador, secretaria ou voluntário
- ativo e datas de auditoria

### Pessoa
- nome, celular, categoria e data de cadastro
- observações com acesso restrito

### AtendimentoSocial
- pessoa/família, tipo, descrição, responsável, situação e datas

### Evento
- título, descrição, início, local, limite, situação e publicação no site

### Inscricao
- evento, pessoa, inscrição, presença e observações

## Regras essenciais

1. O número de membro é criado no servidor e possui restrição de unicidade.
2. Celulares são normalizados antes de salvar e nunca servem como autorização por si só.
3. Acesso por SMS deve usar código temporário, expiração curta e limite de tentativas.
4. Atendimentos sociais são dados sensíveis e ficam restritos a funções autorizadas.
5. Toda criação e alteração relevante deve registrar usuário e data para auditoria.
6. Formulários usam validação Django no servidor; filtros usam ORM parametrizado.
7. Segredos ficam em `.env`, nunca no repositório.

## MySQL no Docker

No `docker-compose.yml`, usar `mysql:8.4`, banco `novavida_db`, usuário próprio e volume persistente. No Django, instalar `mysqlclient` e configurar `ENGINE` como `django.db.backends.mysql`. As senhas devem vir de variáveis de ambiente.

## Próximas etapas

1. Validar endereço, horários, liderança e ministérios com a igreja.
2. Criar os modelos e migrações.
3. Implementar autenticação por SMS com provedor escolhido pela instituição.
4. Aplicar permissões por grupo e testes automatizados.
5. Testar com secretaria e voluntários antes da publicação.