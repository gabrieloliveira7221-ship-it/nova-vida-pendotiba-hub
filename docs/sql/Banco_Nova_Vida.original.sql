create table public.usuario (
  id_usuario uuid primary key references auth.users(id) on delete cascade,
  nome       varchar(120) not null,
  email      varchar(120) not null unique,
  cargo      varchar(60)
);

create table public.bairro (
  id_bairro bigint generated always as identity primary key,
  nome      varchar(80) not null unique
);

create table public.tipo_atendimento (
  id_tipo bigint generated always as identity primary key,
  nome    varchar(80) not null unique
);

create table public.pessoa (
  id_pessoa       bigint generated always as identity primary key,
  nome_completo   varchar(150) not null,
  data_nascimento date,
  telefone        varchar(20),
  endereco        varchar(200),
  observacoes     text,
  data_cadastro   date not null default current_date,
  id_bairro       bigint not null references public.bairro(id_bairro)
);

create table public.atendimento (
  id_atendimento bigint generated always as identity primary key,
  data           date not null default current_date,
  descricao      text,
  status         varchar(20) not null default 'agendado'
                 check (status in ('agendado', 'realizado', 'cancelado')),
  id_pessoa      bigint not null references public.pessoa(id_pessoa) on delete cascade,
  id_tipo        bigint not null references public.tipo_atendimento(id_tipo),
  id_usuario     uuid   not null references public.usuario(id_usuario)
);

create table public.evento (
  id_evento         bigint generated always as identity primary key,
  nome              varchar(120) not null,
  data              date not null,
  horario           time,
  local             varchar(120),
  descricao         text,
  presenca_prevista integer check (presenca_prevista >= 0),
  id_usuario        uuid not null references public.usuario(id_usuario)
);

alter table public.usuario          enable row level security;
alter table public.bairro           enable row level security;
alter table public.tipo_atendimento enable row level security;
alter table public.pessoa           enable row level security;
alter table public.atendimento      enable row level security;
alter table public.evento           enable row level security;

create policy "logado acessa" on public.bairro           for all to authenticated using (true) with check (true);
create policy "logado acessa" on public.tipo_atendimento for all to authenticated using (true) with check (true);
create policy "logado acessa" on public.pessoa           for all to authenticated using (true) with check (true);
create policy "logado acessa" on public.atendimento      for all to authenticated using (true) with check (true);
create policy "logado acessa" on public.evento           for all to authenticated using (true) with check (true);
create policy "logado le usuarios"   on public.usuario for select to authenticated using (true);
create policy "edita o proprio perfil" on public.usuario for all to authenticated
  using (id_usuario = auth.uid()) with check (id_usuario = auth.uid());

insert into public.bairro (nome) values
  ('Pendotiba'), ('Largo da Batalha'), ('Maceió'), ('Badu'), ('Sapê'), ('Matapaca');

insert into public.tipo_atendimento (nome) values
  ('Cesta básica'), ('Aconselhamento'), ('Visita'), ('Oração'), ('Encaminhamento');
