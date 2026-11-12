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
  Tabela,
  areaTextoClasse,
  campoClasse,
} from "@/components/gestao-ui";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  formatarData,
  formatarHora,
  garantirUsuario,
  hojeISO,
  mensagemDeErro,
  textoOuNulo,
} from "@/lib/gestao";

export const Route = createFileRoute("/_authenticated/eventos")({
  head: () => ({
    meta: [
      { title: "Eventos — Gestão Nova Vida" },
      { name: "description", content: "Agenda de eventos da Nova Vida Pendotiba." },
    ],
  }),
  component: Page,
});

type Evento = Tables<"evento">;

function Page() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [somenteProximos, setSomenteProximos] = useState(true);
  const [janelaAberta, setJanelaAberta] = useState(false);
  const [editando, setEditando] = useState<Evento | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");
  const [erroLista, setErroLista] = useState("");

  const eventos = useQuery({
    queryKey: ["eventos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evento")
        .select("*")
        .order("data")
        .order("horario");
      if (error) throw error;
      return data;
    },
  });

  const hoje = hojeISO();
  const filtrados = (eventos.data ?? []).filter(
    (e) =>
      e.nome.toLowerCase().includes(busca.trim().toLowerCase()) &&
      (!somenteProximos || e.data >= hoje),
  );

  async function atualizarListas() {
    await queryClient.invalidateQueries({ queryKey: ["eventos"] });
    await queryClient.invalidateQueries({ queryKey: ["painel"] });
  }

  function abrirCadastro(evento: Evento | null) {
    setEditando(evento);
    setErroForm("");
    setJanelaAberta(true);
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const form = new FormData(evento.currentTarget);
    const nome = String(form.get("nome") ?? "").trim();
    const data = String(form.get("data") ?? "");
    const presenca = textoOuNulo(form.get("presenca_prevista"));
    if (!nome) return setErroForm("Informe o nome do evento.");
    if (!data) return setErroForm("Informe a data do evento.");

    setSalvando(true);
    setErroForm("");
    try {
      const dados = {
        nome,
        data,
        horario: textoOuNulo(form.get("horario")),
        local: textoOuNulo(form.get("local")),
        descricao: textoOuNulo(form.get("descricao")),
        presenca_prevista: presenca === null ? null : Math.max(0, Number(presenca)),
      };
      const { error } = editando
        ? await supabase.from("evento").update(dados).eq("id_evento", editando.id_evento)
        : await supabase.from("evento").insert({ ...dados, id_usuario: await garantirUsuario() });
      if (error) throw error;
      setJanelaAberta(false);
      await atualizarListas();
    } catch (erro) {
      setErroForm(mensagemDeErro(erro));
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(evento: Evento) {
    if (!window.confirm(`Excluir o evento "${evento.nome}"?`)) return;
    setErroLista("");
    const { error } = await supabase.from("evento").delete().eq("id_evento", evento.id_evento);
    if (error) return setErroLista(mensagemDeErro(error));
    await atualizarListas();
  }

  return (
    <AppShell title="Eventos">
      <p className="mb-6 text-sm text-muted-foreground">
        Agenda de celebrações, bazares e atividades da comunidade.
      </p>

      <section className="rounded-md border bg-card">
        <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className={`${campoClasse} pl-10`}
                placeholder="Buscar evento"
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={somenteProximos}
                onChange={(e) => setSomenteProximos(e.target.checked)}
              />
              Só próximos
            </label>
          </div>
          <BotaoPrimario onClick={() => abrirCadastro(null)}>
            <Plus size={16} className="mr-2" />
            Novo evento
          </BotaoPrimario>
        </div>

        {eventos.error && (
          <div className="p-5">
            <Aviso>{mensagemDeErro(eventos.error)}</Aviso>
          </div>
        )}
        {erroLista && (
          <div className="p-5">
            <Aviso>{erroLista}</Aviso>
          </div>
        )}

        <Tabela
          colunas={["Data", "Horário", "Evento", "Local", "Presença prevista", "Ações"]}
          carregando={eventos.isLoading}
          vazio={filtrados.length === 0}
        >
          {filtrados.map((e) => (
            <tr key={e.id_evento} className="hover:bg-surface/60">
              <td className="px-5 py-4 text-sm">{formatarData(e.data)}</td>
              <td className="px-5 py-4 text-sm">{formatarHora(e.horario)}</td>
              <td className="px-5 py-4 text-sm font-bold">{e.nome}</td>
              <td className="px-5 py-4 text-sm">{e.local ?? "—"}</td>
              <td className="px-5 py-4 text-sm">{e.presenca_prevista ?? "—"}</td>
              <td className="flex gap-3 px-5 py-4">
                <BotaoLink onClick={() => abrirCadastro(e)}>Editar</BotaoLink>
                <BotaoLink perigo onClick={() => void excluir(e)}>
                  Excluir
                </BotaoLink>
              </td>
            </tr>
          ))}
        </Tabela>
        <div className="border-t p-4 text-xs text-muted-foreground">
          {filtrados.length} evento(s) encontrado(s)
        </div>
      </section>

      <JanelaFormulario
        key={editando?.id_evento ?? "novo"}
        aberta={janelaAberta}
        aoMudar={setJanelaAberta}
        titulo={editando ? "Editar evento" : "Novo evento"}
        aoEnviar={(e) => void salvar(e)}
        salvando={salvando}
        erro={erroForm}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Nome do evento *">
            <input
              name="nome"
              defaultValue={editando?.nome ?? ""}
              placeholder="Ex: Culto de Jovens"
              className={campoClasse}
            />
          </Campo>
          <Campo rotulo="Data *">
            <input
              type="date"
              name="data"
              defaultValue={editando?.data ?? ""}
              className={campoClasse}
            />
          </Campo>
          <Campo rotulo="Horário">
            <input
              type="time"
              name="horario"
              defaultValue={editando?.horario?.slice(0, 5) ?? ""}
              className={campoClasse}
            />
          </Campo>
          <Campo rotulo="Local">
            <input
              name="local"
              defaultValue={editando?.local ?? ""}
              placeholder="Ex: Templo principal"
              className={campoClasse}
            />
          </Campo>
          <Campo rotulo="Presença prevista">
            <input
              type="number"
              min={0}
              name="presenca_prevista"
              defaultValue={editando?.presenca_prevista ?? ""}
              className={campoClasse}
            />
          </Campo>
        </div>
        <Campo rotulo="Descrição">
          <textarea
            name="descricao"
            defaultValue={editando?.descricao ?? ""}
            placeholder="Descreva os detalhes e objetivos do evento…"
            className={areaTextoClasse}
          />
        </Campo>
      </JanelaFormulario>
    </AppShell>
  );
}
