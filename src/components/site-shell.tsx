import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, LogIn, ArrowRight, Mail } from "lucide-react";
import { useState, type ReactNode } from "react";

const links = [
  ["/", "Início"], ["/conheca", "Conheça-nos"], ["/agenda", "Agenda"],
  ["/ministerios", "Ministérios"], ["/contato", "Contato"],
] as const;

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return <Link to="/" className={`flex items-center gap-3 ${inverse ? "text-primary-foreground" : "text-foreground"}`}>
    <span className="grid size-11 place-items-center rounded-md bg-primary font-display text-xl text-primary-foreground">NV</span>
    <span className="leading-none"><b className="block font-display text-base uppercase">Nova Vida</b><span className="text-[10px] font-bold uppercase tracking-[.22em]">Pendotiba</span></span>
  </Link>;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  return <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([to,label]) => <Link key={to} to={to} className={`text-xs font-extrabold uppercase transition-colors hover:text-primary ${path===to ? "text-primary" : "text-foreground"}`}>{label}</Link>)}
          <Link to="/acesso" className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-xs font-extrabold uppercase text-background"><LogIn size={16}/> Área do membro</Link>
        </nav>
        <button aria-label="Abrir menu" onClick={()=>setOpen(!open)} className="grid size-11 place-items-center rounded-md border bg-background lg:hidden">{open?<X/>:<Menu/>}</button>
      </div>
      {open && <nav className="border-t bg-background px-5 py-5 lg:hidden">{links.map(([to,label])=><Link key={to} to={to} onClick={()=>setOpen(false)} className="block border-b py-4 text-sm font-bold uppercase">{label}</Link>)}<Link to="/acesso" className="mt-5 flex h-12 items-center justify-center gap-2 rounded-md bg-foreground text-sm font-bold text-background"><LogIn size={17}/> Área do membro</Link></nav>}
    </header>
    <main>{children}</main>
    <footer className="bg-ink text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.2fr_.8fr_.8fr] lg:px-8">
        <div><Brand inverse/><p className="mt-5 max-w-sm text-sm leading-7 text-primary-foreground/70">Uma comunidade para viver a fé, servir pessoas e construir novos começos em Pendotiba.</p></div>
        <div><h3 className="text-xs font-extrabold uppercase text-accent">Navegue</h3><div className="mt-5 grid gap-3 text-sm">{links.slice(1).map(([to,label])=><Link key={to} to={to}>{label}</Link>)}</div></div>
        <div><h3 className="text-xs font-extrabold uppercase text-accent">Institucional</h3><a href="mailto:invpendotiba@gmail.com" className="mt-5 flex items-center gap-2 text-sm"><Mail size={16}/> invpendotiba@gmail.com</a><p className="mt-3 text-sm text-primary-foreground/70">CNPJ: 09.615.201/0001-78</p></div>
      </div>
      <div className="border-t border-primary-foreground/15 px-5 py-5 text-center text-xs text-primary-foreground/55">© 2026 Igreja Nova Vida Pendotiba · Projeto acadêmico</div>
    </footer>
  </div>;
}

export function PageIntro({ eyebrow, title, text }: { eyebrow:string; title:string; text:string }) {
  return <section className="bg-ink px-5 py-20 text-primary-foreground lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p className="mb-4 text-xs font-extrabold uppercase text-accent">{eyebrow}</p><h1 className="max-w-4xl font-display text-4xl uppercase leading-[1.02] sm:text-6xl">{title}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-primary-foreground/70">{text}</p></div></section>
}

export function ArrowLink({ to, children }: { to: "/agenda"|"/contato"|"/conheca"|"/ministerios"|"/acesso"; children: ReactNode }) {
  return <Link to={to} className="inline-flex h-12 items-center gap-3 rounded-md bg-primary px-6 text-sm font-extrabold uppercase text-primary-foreground transition-transform hover:-translate-y-0.5">{children}<ArrowRight size={18}/></Link>;
}