import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ClipboardList, Users, type LucideIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Aviso, StatusAtendimento } from "@/components/gestao-ui";
import { supabase } from "@/integrations/supabase/client";
import { formatarData, formatarHora, hojeISO, inicioDoMesISO, mensagemDeErro } from "@/lib/gestao";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel — Gestão Nova Vida" },
      { name: "description", content: "Visão geral de pessoas, atendimentos e eventos." },
    ],
  }),
  component: Page,
});

async function contar(consulta: PromiseLike<{ count: number | null; error: unknown }>) {
  const { count, error } = await consulta;
  if (error) throw error;
  return count ?? 0;
}

function Page() {
  const painel = useQuery({
    queryKey: ["painel"],
    queryFn: async () => {
      const hoje = hojeISO();
      const [pessoas, atendimentosNoMes, proximosEventos, ultimos, proximo] = await Promise.all([
        contar(supabase.from("pessoa").select("*", { count: "exact", head: true })),
        contar(
          supabase
            .from("atendimento")
            .select("*", { count: "exact", head: true })
            .gte("data", inicioDoMesISO()),
        ),
        contar(supabase.from("evento").select("*", { count: "exact", head: true }).gte("data", hoje)),
        supabase
          .from("atendimento")
          .select("id_atendimento, data, status, pessoa(nome_completo), tipo_atendimento(nome)")
          .order("data", { ascending: false })
          .limit(5),
        supabase
          .from("evento")
          .select("nome, data, horario, local")
          .gte("data", hoje)
          .order("data")
          .order("horario")
          .limit(1)
          .maybeSingle(),
      ]);
      if (ultimos.error) throw ultimos.error;
      if (proximo.error) throw proximo.error;
      return { pessoas, atendimentosNoMes, proximosEventos, ultimos: ultimos.data, proximo: proximo.data };
    },
  });

  const cartoes: [LucideIcon, string, number | undefined][] = [
    [Users, "Pessoas cadastradas", painel.data?.pessoas],
    [ClipboardList, "Atendimentos no mês", painel.data?.atendimentosNoMes],
    [CalendarDays, "Próximos eventos", painel.data?.proximosEventos],
  ];

  return (
    <AppShell title="Visão geral">
      {painel.error && <div className="mb-6"><Aviso>{mensagemDeErro(painel.error)}</Aviso></div>}

      <div className="grid gap-4 sm:grid-cols-3">
        {cartoes.map(([Icone, rotulo, valor]) => (
          <article key={rotulo} className="rounded-md border bg-card p-5">
            <Icone className="text-primary" />
            <p className="mt-7 text-sm text-muted-foreground">{rotulo}</p>
            <b className="mt-1 block text-3xl">{valor ?? "…"}</b>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
        <section className="rounded-md border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Últimos atendimentos</h2>
            <Link to="/atendimentos" className="text-xs font-bold text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-5 divide-y">
            {painel.data?.ultimos.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">Nenhum atendimento registrado ainda.</p>
            )}
            {painel.data?.ultimos.map((a) => (
              <div key={a.id_atendimento} className="flex items-center justify-between gap-3 py-4">
                <div>
                  <p className="text-sm font-bold">{a.pessoa?.nome_completo ?? "—"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.tipo_atendimento?.nome ?? "—"} · {formatarData(a.data)}
                  </p>
                </div>
                <StatusAtendimento status={a.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md bg-ink p-6 text-primary-foreground">
          <p className="text-xs font-extrabold uppercase text-accent">Próximo evento</p>
          {painel.data?.proximo ? (
            <>
              <h2 className="mt-4 text-2xl font-extrabold">{painel.data.proximo.nome}</h2>
              <p className="mt-2 text-sm text-primary-foreground/65">
                {formatarData(painel.data.proximo.data)} · {formatarHora(painel.data.proximo.horario)}
              </p>
              {painel.data.proximo.local && (
                <p className="mt-1 text-sm text-primary-foreground/65">{painel.data.proximo.local}</p>
              )}
            </>
          ) : (
            <p className="mt-4 text-sm text-primary-foreground/65">
              {painel.isLoading ? "Carregando…" : "Nenhum evento agendado."}
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
