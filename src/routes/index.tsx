import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, HeartHandshake, Play, Users } from "lucide-react";
import hero from "@/assets/nova-vida-hero.jpg";
import community from "@/assets/comunidade-nova-vida.jpg";
import { ArrowLink, SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Igreja Nova Vida Pendotiba — Uma casa para todos" },
    { name:"description", content:"Conheça a Igreja Nova Vida Pendotiba, acompanhe nossa agenda e faça parte desta família." },
    { property:"og:title", content:"Igreja Nova Vida Pendotiba" }, { property:"og:description", content:"Uma comunidade para viver a fé, servir pessoas e construir novos começos." },
    { property:"og:type", content:"website" }, { name:"twitter:card", content:"summary_large_image" },
  ]}), component: HomePage,
});

const events = [
  { day:"04", month:"OUT", tag:"Celebração", title:"Culto de comunhão", text:"Um encontro de fé, louvor e Palavra para toda a família." },
  { day:"11", month:"OUT", tag:"Famílias", title:"Domingo em família", text:"Um tempo especial para fortalecer vínculos e caminhar juntos." },
  { day:"18", month:"OUT", tag:"Juventude", title:"Conexão Nova Geração", text:"Louvor, conversa e propósito para adolescentes e jovens." },
];

function HomePage(){ return <SiteShell>
  <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-ink text-primary-foreground">
    <img src={hero} width={1920} height={1088} alt="Comunidade reunida em adoração" className="absolute inset-0 h-full w-full object-cover"/>
    <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/65 to-transparent"/>
    <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-end px-5 pb-14 pt-24 lg:px-8 lg:pb-20">
      <div className="max-w-3xl animate-rise"><p className="mb-5 inline-flex rounded-sm bg-accent px-3 py-2 text-xs font-extrabold uppercase text-accent-foreground">Bem-vindo à sua casa</p><h1 className="font-display text-5xl uppercase leading-[.94] sm:text-7xl lg:text-8xl">Uma vida nova começa aqui.</h1><p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/80 sm:text-lg">Uma igreja de braços abertos, onde pessoas encontram Jesus, constroem amizades e vivem seu propósito.</p><div className="mt-8 flex flex-wrap gap-3"><ArrowLink to="/contato">Planeje sua visita</ArrowLink><Link to="/agenda" className="inline-flex h-12 items-center gap-3 rounded-md border border-primary-foreground/60 px-6 text-sm font-extrabold uppercase"><Play size={18}/> Ver programação</Link></div></div>
    </div>
  </section>
  <section className="bg-secondary px-5 py-5 text-secondary-foreground"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><span className="text-xs font-extrabold uppercase">Próximo encontro · dado demonstrativo</span><p className="mt-1 text-lg font-extrabold">Domingo em família — 10h</p></div><Link to="/agenda" className="flex items-center gap-2 text-sm font-extrabold uppercase">Ver agenda <ArrowRight size={18}/></Link></div></section>
  <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2"><div><p className="text-xs font-extrabold uppercase text-primary">Você é parte da família</p><h2 className="mt-4 font-display text-4xl uppercase leading-tight sm:text-5xl">Gente cuidando de gente.</h2><p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">Na Nova Vida Pendotiba, ninguém precisa caminhar sozinho. Somos uma comunidade que celebra, acolhe e serve com simplicidade e propósito.</p><div className="mt-8"><ArrowLink to="/conheca">Conheça nossa história</ArrowLink></div></div><img src={community} loading="lazy" width={1408} height={912} alt="Pessoas da comunidade conversando" className="aspect-[4/3] w-full rounded-md object-cover"/></div></section>
  <section className="bg-surface px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase text-primary">Agenda demonstrativa</p><h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">Próximos encontros</h2></div><ArrowLink to="/agenda">Ver todos</ArrowLink></div><div className="mt-10 grid gap-4 md:grid-cols-3">{events.map(e=><article key={e.title} className="rounded-md border bg-card p-6"><div className="flex items-start justify-between"><div><b className="font-display text-4xl text-primary">{e.day}</b><span className="ml-2 text-xs font-extrabold">{e.month}</span></div><CalendarDays className="text-secondary"/></div><p className="mt-8 text-xs font-extrabold uppercase text-primary">{e.tag}</p><h3 className="mt-2 text-xl font-extrabold">{e.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{e.text}</p></article>)}</div></div></section>
  <section className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">{[[Users,"Encontre seu lugar","Ministérios para diferentes fases da vida."],[HeartHandshake,"Cuidado que alcança","Acolhimento, oração e apoio à comunidade."],[CalendarDays,"Caminhe conosco","Encontros que fortalecem a fé e os vínculos."]].map(([Icon,title,text])=><div key={String(title)} className="border-t-4 border-primary pt-7"><Icon className="text-secondary" size={34}/><h3 className="mt-5 text-xl font-extrabold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{String(text)}</p></div>)}</div></section>
</SiteShell> }