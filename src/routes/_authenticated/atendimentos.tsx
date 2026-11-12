import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/app-shell";
import {
  Aviso,
  BotaoLink,
  BotaoPrimario,
  Campo,
  JanelaFormulario,
  StatusAtendimento,
  Tabela,
  areaTextoClasse,
  campoClasse,
} from "@/components/gestao-ui";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { formatarData, garantirUsuario, hojeISO, mensagemDeErro, textoOuNulo } from "@/lib/gestao";

export const Route = createFileRoute("/_authenticated/atendimentos")({
  head: () => ({
    meta: [
      { title: "Atendimentos — Gestão Nova Vida" },
      { name: "description", content: "Registro e acompanhamento dos atendimentos sociais." },
    ],
  }),
  component: Page,
});

type Atendimento = Tables<"atendimento"> & {
  pessoa: { nome_completo: string } | null;
  tipo_atendimento: { nome: string } | null;
  usuario: { nome: string } | null;
};

const STATUS = [
  { valor: "agendado", rotulo: "Agendado" },
  { valor: "realizado", rotulo: "Realizado" },
  { valor: "cancelado", rotulo: "Cancelado" },
];

function Page() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");
  const [janelaAberta, setJanelaAberta] = useState(false);
  const [editando, setEditando] = useState<Atendimento | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");
  const [erroLista, setErroLista] = useState("");

  const atendimentos = useQuery({
    queryKey: ["atendimentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendimento")
        .select("*, pessoa(nome_completo), tipo_atendimento(nome), usuario(nome)")
        .order("data", { ascending: false });
      if (error) throw error;
      return data as Atendimento[];
    },
  });

  const pessoas = useQuery({
    queryKey: ["pessoas-opcoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pessoa")
        .select("id_pessoa, nome_completo")
        .order("nome_completo");
      if (error) throw error;
      return data;
    },
  });

  const tipos = useQuery({
    queryKey: ["tipos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tipo_atendimento").select("*").order("nome");
      if (error) throw error;
      return data;
    },
  });

  const filtrados = (atendimentos.data ?? []).filter(
    (a) =>
      (a.pessoa?.nome_completo ?? "").toLowerCase().includes(busca.trim().toLowerCase()) &&
      (tipoFiltro === "" || String(a.id_tipo) === tipoFiltro) &&
      (statusFiltro === "" || a.status === statusFiltro) &&
      (dataFiltro === "" || a.data === dataFiltro),
  );

  async function atualizarListas() {
    await queryClient.invalidateQueries({ queryKey: ["atendimentos"] });
    await queryClient.invalidateQueries({ queryKey: ["historico"] });
    await queryClient.invalidateQueries({ queryKey: ["painel"] });
  }

  function abrirCadastro(atendimento: Atendimento | null) {
    setEditando(atendimento);
    setErroForm("");
    setJanelaAberta(true);
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const form = new FormData(evento.currentTarget);
    const idPessoa = Number(form.get("id_pessoa"));
    const idTipo = Number(form.get("id_tipo"));
    const data = String(form.get("data") ?? "");
    if (!idPessoa) return setErroForm("Escolha a pessoa atendida.");
    if (!idTipo) return setErroForm("Escolha o tipo de atendimento.");
    if (!data) return setErroForm("Informe a data.");

    setSalvando(true);
    setErroForm("");
    try {
      const dados = {
        id_pessoa: idPessoa,
        id_tipo: idTipo,
        data,
        status: String(form.get("status") ?? "agendado"),
        descricao: textoOuNulo(form.get("descricao")),
      };
      const { error } = editando
        ? await supabase
            .from("atendimento")
            .update(dados)
            .eq("id_atendimento", editando.id_atendimento)
        : await supabase
            .from("atendimento")
            .insert({ ...dados, id_usuario: await garantirUsuario() });
      if (error) throw error;
      setJanelaAberta(false);
      await atualizarListas();
    } catch (erro) {
      setErroForm(mensagemDeErro(erro));
    } finally {
      setSalvando(false);
    }
  }

  async function mudarStatus(atendimento: Atendimento, status: string) {
    setErroLista("");
    const { error } = await supabase
      .from("atendimento")
      .update({ status })
      .eq("id_atendimento", atendimento.id_atendimento);
    if (error) return setErroLista(mensagemDeErro(error));
    await atualizarListas();
  }

  async function excluir(atendimento: Atendimento) {
    if (!window.confirm("Excluir este atendimento do histórico?")) return;
    setErroLista("");
    const { error } = await supabase
      .from("atendimento")
      .delete()
      .eq("id_atendimento", atendimento.id_atendimento);
    if (error) return setErroLista(mensagemDeErro(error));
    await atualizarListas();
  }

  return (
    <AppShell title="Atendimentos sociais">
      <p className="mb-6 text-sm text-muted-foreground">
        Registre quem foi atendido, como e quando. Registros sensíveis: acesso somente para pessoas
        autorizadas.
      </p>

      <section className="rounded-md border bg-card">
        <div className="flex flex-col gap-4 border-b p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className={`${campoClasse} pl-10`}
                placeholder="Buscar por pessoa"
              />
            </div>
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className={campoClasse}
              aria-label="Filtrar por tipo"
            >
              <option value="">Todos os tipos</option>
              {tipos.data?.map((t) => (
                <option key={t.id_tipo} value={t.id_tipo}>
                  {t.nome}
                </option>
              ))}
            </select>
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className={campoClasse}
              aria-label="Filtrar por situação"
            >
              <option value="">Todas as situações</option>
              {STATUS.map((s) => (
                <option key={s.valor} value={s.valor}>
                  {s.rotulo}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
              className={campoClasse}
              aria-label="Filtrar por data"
            />
          </div>
          <BotaoPrimario onClick={() => abrirCadastro(null)}>
            <Plus size={16} className="mr-2" />
            Novo atendimento
          </BotaoPrimario>
        </div>

        {atendimentos.error && (
          <div className="p-5">
            <Aviso>{mensagemDeErro(atendimentos.error)}</Aviso>
          </div>
        )}
        {erroLista && (
          <div className="p-5">
            <Aviso>{erroLista}</Aviso>
          </div>
        )}

        <Tabela
          colunas={["Pessoa", "Tipo", "Data", "Responsável", "Situação", "Ações"]}
          carregando={atendimentos.isLoading}
          vazio={filtrados.length === 0}
        >
          {filtrados.map((a) => (
            <tr key={a.id_atendimento} className="hover:bg-surface/60">
              <td className="px-5 py-4 text-sm font-bold">{a.pessoa?.nome_completo ?? "—"}</td>
              <td className="px-5 py-4 text-sm">{a.tipo_atendimento?.nome ?? "—"}</td>
              <td className="px-5 py-4 text-sm">{formatarData(a.data)}</td>
              <td className="px-5 py-4 text-sm">{a.usuario?.nome ?? "—"}</td>
              <td className="px-5 py-4 text-sm">
                <StatusAtendimento status={a.status} />
              </td>
              <td className="flex flex-wrap gap-3 px-5 py-4">
                {a.status === "agendado" && (
                  <>
                    <BotaoLink onClick={() => void mudarStatus(a, "realizado")}>
                      Realizado
                    </BotaoLink>
                    <BotaoLink onClick={() => void mudarStatus(a, "cancelado")}>Cancelar</BotaoLink>
                  </>
                )}
                <BotaoLink onClick={() => abrirCadastro(a)}>Editar</BotaoLink>
                <BotaoLink perigo onClick={() => void excluir(a)}>
                  Excluir
                </BotaoLink>
              </td>
            </tr>
          ))}
        </Tabela>
        <div className="border-t p-4 text-xs text-muted-foreground">
          {filtrados.length} atendimento(s) encontrado(s)
        </div>
      </section>

      <JanelaFormulario
        key={editando?.id_atendimento ?? "novo"}
        aberta={janelaAberta}
        aoMudar={setJanelaAberta}
        titulo={editando ? "Editar atendimento" : "Novo atendimento"}
        {...(pessoas.data?.length === 0
          ? { descricao: "Cadastre uma pessoa antes de registrar um atendimento." }
          : {})}
        aoEnviar={(e) => void salvar(e)}
        salvando={salvando}
        erro={erroForm}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Pessoa *">
            <select
              name="id_pessoa"
              defaultValue={editando ? String(editando.id_pessoa) : ""}
              className={campoClasse}
            >
              <option value="">Selecione a pessoa</option>
              {pessoas.data?.map((p) => (
                <option key={p.id_pessoa} value={p.id_pessoa}>
                  {p.nome_completo}
                </option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Tipo de atendimento *">
            <select
              name="id_tipo"
              defaultValue={editando ? String(editando.id_tipo) : ""}
              className={campoClasse}
            >
              <option value="">Selecione o tipo</option>
              {tipos.data?.map((t) => (
                <option key={t.id_tipo} value={t.id_tipo}>
                  {t.nome}
                </option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Data *">
            <input
              type="date"
              name="data"
              defaultValue={editando?.data ?? hojeISO()}
              className={campoClasse}
            />
          </Campo>
          <Campo rotulo="Situação">
            <select
              name="status"
              defaultValue={editando?.status ?? "agendado"}
              className={campoClasse}
            >
              {STATUS.map((s) => (
                <option key={s.valor} value={s.valor}>
                  {s.rotulo}
                </option>
              ))}
            </select>
          </Campo>
        </div>
        <Campo rotulo="Descrição">
          <textarea
            name="descricao"
            defaultValue={editando?.descricao ?? ""}
            placeholder="Descreva os detalhes do atendimento prestado…"
            className={areaTextoClasse}
          />
        </Campo>
      </JanelaFormulario>
    </AppShell>
  );
}
