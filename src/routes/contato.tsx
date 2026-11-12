import type { FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Send } from "lucide-react";
import { InfoPage } from "@/components/info-page";
export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Nova Vida Pendotiba" },
      {
        name: "description",
        content: "Entre em contato com a Igreja Nova Vida Pendotiba ou envie um pedido de oração.",
      },
      { property: "og:title", content: "Fale com a Nova Vida Pendotiba" },
      { property: "og:description", content: "Queremos ouvir você e caminhar ao seu lado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function enviarPorEmail(evento: FormEvent<HTMLFormElement>) {
  evento.preventDefault();
  const form = new FormData(evento.currentTarget);
  const assunto = String(form.get("assunto") ?? "Contato pelo site");
  const corpo = [
    String(form.get("mensagem") ?? ""),
    "",
    `Nome: ${String(form.get("nome") ?? "")}`,
    `E-mail: ${String(form.get("email") ?? "")}`,
  ].join("\n");
  window.location.href = `mailto:invpendotiba@gmail.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
}

function Page() {
  return (
    <InfoPage
      eyebrow="Fale conosco"
      title="Queremos ouvir você."
      text="Envie sua mensagem, pedido de oração ou solicitação de visita. Ao enviar, seu aplicativo de e-mail abre com a mensagem pronta."
    >
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <h2 className="font-display text-2xl uppercase">Canais oficiais</h2>
          <a
            href="mailto:invpendotiba@gmail.com"
            className="mt-6 flex items-center gap-3 text-sm font-bold"
          >
            <Mail className="text-primary" />
            invpendotiba@gmail.com
          </a>
          <p className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="text-primary" />
            Pendotiba, Niterói – RJ
          </p>
          <div className="mt-8 rounded-md bg-surface p-5 text-sm leading-6 text-muted-foreground">
            Para pedidos de oração, visitas ou qualquer outro assunto, fale com a gente pelo e-mail.
            Respondemos o mais breve possível.
          </div>
        </div>
        <form onSubmit={enviarPorEmail} className="grid gap-5 rounded-md border bg-card p-7">
          <label className="grid gap-2 text-sm font-bold">
            Nome
            <input
              required
              name="nome"
              maxLength={100}
              className="h-12 rounded-md border bg-background px-4 font-normal"
              placeholder="Seu nome"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            E-mail
            <input
              required
              type="email"
              name="email"
              maxLength={255}
              className="h-12 rounded-md border bg-background px-4 font-normal"
              placeholder="voce@exemplo.com"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Assunto
            <select
              name="assunto"
              className="h-12 rounded-md border bg-background px-4 font-normal"
            >
              <option>Pedido de oração</option>
              <option>Planejar uma visita</option>
              <option>Falar com a equipe</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Mensagem
            <textarea
              required
              name="mensagem"
              maxLength={1000}
              rows={5}
              className="rounded-md border bg-background p-4 font-normal"
              placeholder="Como podemos ajudar?"
            />
          </label>
          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-extrabold uppercase text-primary-foreground">
            Enviar mensagem <Send size={17} />
          </button>
        </form>
      </div>
    </InfoPage>
  );
}
