import { createFileRoute } from "@tanstack/react-router";
import community from "@/assets/comunidade-nova-vida.jpg";
import { InfoPage, SectionHeading } from "@/components/info-page";

export const Route = createFileRoute("/conheca")({
  head: () => ({
    meta: [
      { title: "Conheça-nos — Nova Vida Pendotiba" },
      {
        name: "description",
        content: "Conheça a identidade, missão, visão e valores da Igreja Nova Vida Pendotiba.",
      },
      { property: "og:title", content: "Conheça a Nova Vida Pendotiba" },
      {
        property: "og:description",
        content: "Uma igreja que existe para acolher, servir e formar discípulos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return (
    <InfoPage
      eyebrow="Nossa identidade"
      title="Uma igreja feita de pessoas."
      text="Caminhamos juntos para conhecer Jesus, cuidar uns dos outros e servir Pendotiba com amor e responsabilidade."
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <img
          src={community}
          loading="lazy"
          width={1408}
          height={912}
          alt="Comunidade Nova Vida reunida"
          className="aspect-[4/3] rounded-md object-cover"
        />
        <div>
          <SectionHeading
            label="Quem somos"
            title="Fé prática. Comunidade presente."
            text="A Igreja Nova Vida Pendotiba é uma comunidade cristã comprometida com o Evangelho, a comunhão e o cuidado com pessoas. Este texto é uma proposta inicial e deverá ser validado pela liderança da igreja."
          />
          <div className="mt-8 border-l-4 border-secondary pl-5 text-sm leading-7 text-muted-foreground">
            História, liderança e declaração de fé serão acrescentadas após a entrevista com os
            responsáveis.
          </div>
        </div>
      </div>
      <div className="mt-20 grid gap-4 md:grid-cols-3">
        {[
          ["Missão", "Conectar pessoas a Jesus e ajudá-las a viver uma fé que transforma."],
          ["Visão", "Ser uma comunidade acolhedora, relevante e presente em Pendotiba."],
          ["Valores", "Fé, amor, serviço, integridade, família e generosidade."],
        ].map(([a, b]) => (
          <article key={a} className="rounded-md border bg-card p-7">
            <h3 className="font-display text-2xl uppercase text-primary">{a}</h3>
            <p className="mt-4 leading-7 text-muted-foreground">{b}</p>
          </article>
        ))}
      </div>
    </InfoPage>
  );
}
