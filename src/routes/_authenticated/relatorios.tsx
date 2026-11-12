import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Aviso } from "@/components/gestao-ui";
import { supabase } from "@/integrations/supabase/client";
import { mensagemDeErro } from "@/lib/gestao";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Gestão Nova Vida" },
      { name: "description", content: "Indicadores de atendimentos da Nova Vida Pendotiba." },
    ],
  }),
  component: Page,
});

const NOMES_MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

/** Últimos 6 meses no formato AAAA-MM, do mais antigo ao atual. */
function ultimosSeisMeses(): string[] {
  const agora = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(agora.getFullYear(), agora.getMonth() - 5 + i, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

function contarPor(lista: string[]): [string, number][] {
  const contagem = new Map<string, number>();
  for (const item of lista) contagem.set(item, (contagem.get(item) ?? 0) + 1);
  return [...contagem.entries()].sort((a, b) => b[1] - a[1]);
}

function Page() {
  const relatorio = useQuery({
    queryKey: ["relatorio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendimento")
        .select("data, status, tipo_atendimento(nome)");
      if (error) throw error;
      return data;
    },
  });

  const atendimentos = relatorio.data ?? [];
  const meses = ultimosSeisMeses();
  const porMes = meses.map((mes) => atendimentos.filter((a) => a.data.startsWith(mes)).length);
  const maiorMes = Math.max(1, ...porMes);
  const porTipo = contarPor(atendimentos.map((a) => a.tipo_atendimento?.nome ?? "Sem tipo"));
  const porStatus = contarPor(atendimentos.map((a) => a.status));
  const total = atendimentos.length || 1;

  return (
    <AppShell title="Relatórios">
      {relatorio.error && (
        <div className="mb-6">
          <Aviso>{mensagemDeErro(relatorio.error)}</Aviso>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-md border bg-card p-6">
          <p className="text-xs font-extrabold uppercase text-primary">Últimos 6 meses</p>
          <h2 className="mt-2 text-xl font-extrabold">Atendimentos por mês</h2>
          <div className="mt-8 flex h-56 items-end gap-4 border-b border-l px-4">
            {porMes.map((valor, i) => (
              <div
                key={meses[i]}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                <span className="text-xs font-bold">{valor}</span>
                <div
                  className="w-full rounded-t-sm bg-primary"
                  style={{ height: `${(valor / maiorMes) * 85}%` }}
                  title={`${valor} atendimento(s)`}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-around text-xs text-muted-foreground">
            {meses.map((mes) => (
              <span key={mes}>{NOMES_MESES[Number(mes.slice(5, 7)) - 1]}</span>
            ))}
          </div>
        </section>

        <section className="rounded-md border bg-card p-6">
          <p className="text-xs font-extrabold uppercase text-primary">Distribuição</p>
          <h2 className="mt-2 text-xl font-extrabold">Atendimentos por tipo</h2>
          <Barras
            itens={porTipo}
            total={total}
            vazio={!relatorio.isLoading && atendimentos.length === 0}
          />

          <h2 className="mt-10 text-xl font-extrabold">Atendimentos por situação</h2>
          <Barras
            itens={porStatus.map(([s, n]) => [s.charAt(0).toUpperCase() + s.slice(1), n])}
            total={total}
            vazio={!relatorio.isLoading && atendimentos.length === 0}
          />
        </section>
      </div>
    </AppShell>
  );
}

function Barras({
  itens,
  total,
  vazio,
}: {
  itens: [string, number][];
  total: number;
  vazio: boolean;
}) {
  if (vazio)
    return (
      <p className="mt-6 text-sm text-muted-foreground">Nenhum atendimento registrado ainda.</p>
    );
  return (
    <div className="mt-6 grid gap-5">
      {itens.map(([nome, valor]) => (
        <div key={nome}>
          <div className="flex justify-between text-sm">
            <span className="font-bold">{nome}</span>
            <span>{valor}</span>
          </div>
          <div className="mt-2 h-3 rounded-sm bg-muted">
            <div
              className="h-3 rounded-sm bg-secondary"
              style={{ width: `${(valor / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
