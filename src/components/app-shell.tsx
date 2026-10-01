import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, CalendarDays, ClipboardList, Home, LogOut, Menu, Users, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Brand } from "./site-shell";

const nav=[{to:"/painel" as const,label:"Visão geral",icon:Home},{to:"/pessoas" as const,label:"Pessoas",icon:Users},{to:"/atendimentos" as const,label:"Atendimentos",icon:ClipboardList},{to:"/eventos" as const,label:"Eventos",icon:CalendarDays},{to:"/relatorios" as const,label:"Relatórios",icon:BarChart3}];

export function AppShell({title,eyebrow="Área de gestão",children}:{title:string;eyebrow?:string;children:ReactNode}){
 const [open,setOpen]=useState(false); const path=useRouterState({select:s=>s.location.pathname});
 return <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[260px_1fr]">
  <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-ink p-5 text-primary-foreground transition-transform lg:static lg:translate-x-0 ${open?"translate-x-0":"-translate-x-full"}`}><div className="flex items-center justify-between"><Brand inverse/><button aria-label="Fechar menu" className="lg:hidden" onClick={()=>setOpen(false)}><X/></button></div><nav className="mt-12 grid gap-2">{nav.map(n=><Link key={n.to} to={n.to} onClick={()=>setOpen(false)} className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-bold ${path===n.to?"bg-primary text-primary-foreground":"text-primary-foreground/65 hover:bg-primary-foreground/10"}`}><n.icon size={18}/>{n.label}</Link>)}</nav><div className="absolute bottom-6 left-5 right-5 border-t border-primary-foreground/15 pt-5"><p className="text-sm font-bold">Marina Alves</p><p className="text-xs text-primary-foreground/55">Secretaria · NV-2026-001</p><Link to="/acesso" className="mt-4 flex items-center gap-2 text-xs font-bold uppercase text-primary-foreground/70"><LogOut size={16}/> Sair da demonstração</Link></div></aside>
  <div><header className="flex h-20 items-center justify-between border-b bg-background px-5 lg:px-8"><div className="flex items-center gap-4"><button aria-label="Abrir menu" onClick={()=>setOpen(true)} className="grid size-10 place-items-center rounded-md border lg:hidden"><Menu/></button><div><p className="text-[10px] font-extrabold uppercase text-primary">{eyebrow}</p><h1 className="text-xl font-extrabold">{title}</h1></div></div><span className="hidden rounded-md bg-accent px-3 py-2 text-xs font-extrabold text-accent-foreground sm:block">Dados demonstrativos</span></header><main className="p-5 lg:p-8">{children}</main></div>
 </div>
}

export function EmptyButton({children}:{children:ReactNode}){return <button onClick={()=>alert("Ação demonstrativa do protótipo.")} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground">{children}</button>}
