import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { InfoPage } from "@/components/info-page";
import { diaEMes, listarEventosPublicos } from "@/lib/agenda.functions";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda — Nova Vida Pendotiba" },
      {
        name: "description",
        content: "Veja a agenda de cultos e eventos da Nova Vida Pendotiba.",
      },
      { property: "og:title", content: "Agenda da Nova Vida Pendotiba" },
      { property: "og:description", content: "Cultos, encontros e atividades da comunidade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listarEventosPublicos(),
  component: Page,
});

function Page() {
  const eventos = Route.useLoaderData();

  return (
    <InfoPage
      eyebrow="Agenda"
      title="Há um lugar esperando por você."
      text="Confira os próximos encontros da nossa comunidade."
    >
      {eventos.length === 0 ? (
        <p className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
          Nenhum evento agendado no momento. Volte em breve!
        </p>
      ) : (
        <div className="grid gap-4">
          {eventos.map((evento) => {
            const { dia, mes } = diaEMes(evento.data);
            return (
              <article
                key={evento.id_evento}
                className="grid gap-5 rounded-md border bg-card p-6 sm:grid-cols-[110px_1fr_auto] sm:items-center"
              >
                <div className="font-display text-3xl text-primary">
                  {dia} {mes}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">{evento.nome}</h2>
                  {evento.descricao && (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {evento.descricao}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex gap-2">
                      <Clock size={17} />
                      {evento.horario ? evento.horario.slice(0, 5) : "Horário a definir"}
                    </span>
                    <span className="flex gap-2">
                      <MapPin size={17} />
                      {evento.local ?? "Local a definir"}
                    </span>
                  </div>
                </div>
                <CalendarDays className="text-secondary" size={28} />
              </article>
            );
          })}
        </div>
      )}
    </InfoPage>
  );
}
