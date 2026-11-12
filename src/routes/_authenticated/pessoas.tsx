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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { formatarData, mensagemDeErro, textoOuNulo } from "@/lib/gestao";

export const Route = createFileRoute("/_authenticated/pessoas")({
  head: () => ({
    meta: [
      { title: "Pessoas — Gestão Nova Vida" },
      { name: "description", content: "Cadastro de pessoas atendidas pela Nova Vida Pendotiba." },
    ],
  }),
  component: Page,
});

type Pessoa = Tables<"pessoa"> & { bairro: { nome: string } | null };

function Page() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [bairroFiltro, setBairroFiltro] = useState("");
  const [janelaAberta, setJanelaAberta] = useState(false);
  const [editando, setEditando] = useState<Pessoa | null>(null);
  const [historicoDe, setHistoricoDe] = useState<Pessoa | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");
  const [erroLista, setErroLista] = useState("");

  const pessoas = useQuery({
    queryKey: ["pessoas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pessoa")
        .select("*, bairro(nome)")
        .order("nome_completo");
      if (error) throw error;
      return data as Pessoa[];
    },
  });

  const bairros = useQuery({
    queryKey: ["bairros"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bairro").select("*").order("nome");
      if (error) throw error;
      return data;
    },
  });

  const filtradas = (pessoas.data ?? []).filter(
    (p) =>
      p.nome_completo.toLowerCase().includes(busca.trim().toLowerCase()) &&
      (bairroFiltro === "" || String(p.id_bairro) === bairroFiltro),
  );

  function abrirCadastro(pessoa: Pessoa | null) {
    setEditando(pessoa);
    setErroForm("");
    setJanelaAberta(true);
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const form = new FormData(evento.currentTarget);
    const nome = String(form.get("nome_completo") ?? "").trim();
    const idBairro = Number(form.get("id_bairro"));
    if (!nome) return setErroForm("Informe o nome completo.");
    if (!idBairro) return setErroForm("Escolha o bairro.");

    const dados = {
      nome_completo: nome,
      data_nascimento: textoOuNulo(form.get("data_nascimento")),
      telefone: textoOuNulo(form.get("telefone")),
      endereco: textoOuNulo(form.get("endereco")),
      observacoes: textoOuNulo(form.get("observacoes")),
      id_bairro: idBairro,
    };

    setSalvando(true);
    setErroForm("");
    const { error } = editando
      ? await supabase.from("pessoa").update(dados).eq("id_pessoa", editando.id_pessoa)
      : await supabase.from("pessoa").insert(dados);
    setSalvando(false);
    if (error) return setErroForm(mensagemDeErro(error));

    setJanelaAberta(false);
    await queryClient.invalidateQueries({ queryKey: ["pessoas"] });
  }

  async function excluir(pessoa: Pessoa) {
    const ok = window.confirm(
      `Excluir ${pessoa.nome_completo}? Os atendimentos dessa pessoa também serão excluídos.`,
    );
    if (!ok) return;
    setErroLista("");
    const { error } = await supabase.from("pessoa").delete().eq("id_pessoa", pessoa.id_pessoa);
    if (error) return setErroLista(mensagemDeErro(error));
    await queryClient.invalidateQueries({ queryKey: ["pessoas"] });
    await queryClient.invalidateQueries({ queryKey: ["atendimentos"] });
  }

  return (
    <AppShell title="Pessoas">
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Cadastre, encontre e acompanhe as pessoas atendidas pela igreja.
      </p>

      <section className="rounded-md border bg-card">
        <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className={`${campoClasse} pl-10`}
                placeholder="Buscar por nome"
              />
            </div>
            <select
              value={bairroFiltro}
              onChange={(e) => setBairroFiltro(e.target.value)}
              className={`${campoClasse} sm:w-56`}
              aria-label="Filtrar por bairro"
            >
              <option value="">Todos os bairros</option>
              {bairros.data?.map((b) => (
                <option key={b.id_bairro} value={b.id_bairro}>
                  {b.nome}
                </option>
              ))}
            </select>
          </div>
          <BotaoPrimario onClick={() => abrirCadastro(null)}>
            <Plus size={16} className="mr-2" />
            Cadastrar pessoa
          </BotaoPrimario>
        </div>

        {pessoas.error && <div className="p-5"><Aviso>{mensagemDeErro(pessoas.error)}</Aviso></div>}
        {erroLista && <div className="p-5"><Aviso>{erroLista}</Aviso></div>}

        <Tabela
          colunas={["Nome", "Telefone", "Bairro", "Cadastro", "Ações"]}
          carregando={pessoas.isLoading}
          vazio={filtradas.length === 0}
        >
          {filtradas.map((p) => (
            <tr key={p.id_pessoa} className="hover:bg-surface/60">
              <td className="px-5 py-4 text-sm font-bold">{p.nome_completo}</td>
              <td className="px-5 py-4 text-sm">{p.telefone ?? "—"}</td>
              <td className="px-5 py-4 text-sm">{p.bairro?.nome ?? "—"}</td>
              <td className="px-5 py-4 text-sm">{formatarData(p.data_cadastro)}</td>
              <td className="flex gap-3 px-5 py-4">
                <BotaoLink onClick={() => setHistoricoDe(p)}>Histórico</BotaoLink>
                <BotaoLink onClick={() => abrirCadastro(p)}>Editar</BotaoLink>
                <BotaoLink perigo onClick={() => void excluir(p)}>Excluir</BotaoLink>
              </td>
            </tr>
          ))}
        </Tabela>
        <div className="border-t p-4 text-xs text-muted-foreground">
          {filtradas.length} pessoa(s) encontrada(s)
        </div>
      </section>

      <JanelaFormulario
        key={editando?.id_pessoa ?? "nova"}
        aberta={janelaAberta}
        aoMudar={setJanelaAberta}
        titulo={editando ? "Editar pessoa" : "Cadastro de pessoa"}
        aoEnviar={(e) => void salvar(e)}
        salvando={salvando}
        erro={erroForm}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Nome completo *">
            <input name="nome_completo" defaultValue={editando?.nome_completo ?? ""} className={campoClasse} />
          </Campo>
          <Campo rotulo="Data de nascimento">
            <input type="date" name="data_nascimento" defaultValue={editando?.data_nascimento ?? ""} className={campoClasse} />
          </Campo>
          <Campo rotulo="Telefone">
            <input name="telefone" defaultValue={editando?.telefone ?? ""} placeholder="(21) 99999-0000" className={campoClasse} />
          </Campo>
          <Campo rotulo="Bairro *">
            <select name="id_bairro" defaultValue={editando ? String(editando.id_bairro) : ""} className={campoClasse}>
              <option value="">Selecione</option>
              {bairros.data?.map((b) => (
                <option key={b.id_bairro} value={b.id_bairro}>
                  {b.nome}
                </option>
              ))}
            </select>
          </Campo>
        </div>
        <Campo rotulo="Endereço completo">
          <input name="endereco" defaultValue={editando?.endereco ?? ""} className={campoClasse} />
        </Campo>
        <Campo rotulo="Observações">
          <textarea name="observacoes" defaultValue={editando?.observacoes ?? ""} className={areaTextoClasse} />
        </Campo>
      </JanelaFormulario>

      <Historico pessoa={historicoDe} aoFechar={() => setHistoricoDe(null)} />
    </AppShell>
  );
}

/** Histórico de atendimentos de uma pessoa: quem foi atendido, como, quando e por quem. */
function Historico({ pessoa, aoFechar }: { pessoa: Pessoa | null; aoFechar: () => void }) {
  const historico = useQuery({
    queryKey: ["historico", pessoa?.id_pessoa],
    enabled: pessoa !== null,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendimento")
        .select("id_atendimento, data, status, descricao, tipo_atendimento(nome), usuario(nome)")
        .eq("id_pessoa", pessoa?.id_pessoa ?? 0)
        .order("data", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Dialog open={pessoa !== null} onOpenChange={(aberta) => !aberta && aoFechar()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Histórico de {pessoa?.nome_completo}</DialogTitle>
        </DialogHeader>
        {historico.isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
        {historico.error && <Aviso>{mensagemDeErro(historico.error)}</Aviso>}
        {historico.data?.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum atendimento registrado para esta pessoa.</p>
        )}
        <div className="divide-y">
          {historico.data?.map((a) => (
            <div key={a.id_atendimento} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold">
                  {a.tipo_atendimento?.nome ?? "—"} · {formatarData(a.data)}
                </p>
                <StatusAtendimento status={a.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Responsável: {a.usuario?.nome ?? "—"}
                {a.descricao ? ` · ${a.descricao}` : ""}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

