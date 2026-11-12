import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import hero from "@/assets/nova-vida-hero.jpg";
import { Brand } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/components/auth-provider";

export const Route = createFileRoute("/acesso")({
  head: () => ({ meta: [
    { title: "Acesso — Nova Vida Pendotiba" },
    { name: "description", content: "Entre com e-mail e senha ou cadastre sua conta na Nova Vida Pendotiba." },
    { property: "og:title", content: "Acesso — Nova Vida Pendotiba" },
    { property: "og:description", content: "Acesso seguro à área reservada da Nova Vida Pendotiba." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() {
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAccount();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const nome = String(form.get("nome") ?? "").trim();
    const cargo = String(form.get("cargo") ?? "").trim();
    if (register && !nome) { setError("Informe seu nome completo."); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      if (register) {
        const { data, error } = await supabase.auth.signUp({ email, password, options: {
          data: { nome, cargo }, emailRedirectTo: `${window.location.origin}/acesso`,
        } });
        if (error) throw error;
        if (!data.session) { setMessage("Confira seu e-mail para confirmar o cadastro. Depois, entre com e-mail e senha."); return; }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      await navigate({ to: "/painel", replace: true });
    } catch (err) {
      const code = err && typeof err === "object" && "code" in err ? String(err.code) : "";
      setError(code === "invalid_credentials" ? "E-mail ou senha incorretos." : code === "email_not_confirmed" ? "Confirme seu e-mail antes de entrar." : code === "user_already_exists" ? "Este e-mail já possui cadastro. Entre com sua senha." : code === "weak_password" ? "Escolha uma senha mais forte." : code === "over_email_send_rate_limit" ? "Aguarde alguns minutos antes de tentar novamente." : "Não foi possível concluir. Confira seus dados e tente novamente.");
    } finally { setBusy(false); }
  }
  return <div className="min-h-screen lg:grid lg:grid-cols-2">
    <section className="relative hidden overflow-hidden bg-ink lg:block"><img src={hero} width={1920} height={1088} alt="Comunidade em celebração" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-ink/65"/><div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground"><Brand inverse/><blockquote className="max-w-lg font-display text-4xl uppercase leading-tight">Cuidar bem das pessoas também é parte da nossa missão.</blockquote></div></section>
    <section className="flex min-h-screen items-center justify-center px-5 py-12"><div className="w-full max-w-md">
      <Link to="/" className="mb-10 flex items-center gap-2 text-sm font-bold text-muted-foreground"><ArrowLeft size={17}/> Voltar ao site</Link>
      <p className="text-xs font-extrabold uppercase text-primary">Nova Vida Pendotiba</p><h1 className="mt-3 font-display text-4xl uppercase">{register ? "Faça seu cadastro" : "Área do membro"}</h1>
      {user ? <div className="mt-8 grid gap-4"><p className="break-words text-sm text-muted-foreground">Você está conectado como {user.email}.</p><Button asChild className="h-12"><Link to="/painel">Abrir meu painel</Link></Button></div> : <>
        <form onSubmit={submit} className="mt-8 grid gap-5">
          {register && <><label className="grid gap-2 text-sm font-bold">Nome completo<input name="nome" required maxLength={120} autoComplete="name" className="h-12 rounded-md border bg-background px-4 font-normal"/></label><label className="grid gap-2 text-sm font-bold">Cargo<input name="cargo" required maxLength={60} className="h-12 rounded-md border bg-background px-4 font-normal"/></label></>}
          <label className="grid gap-2 text-sm font-bold">E-mail<input name="email" type="email" required maxLength={120} autoComplete="email" className="h-12 rounded-md border bg-background px-4 font-normal"/></label>
          <label className="grid gap-2 text-sm font-bold">Senha<input name="password" type="password" required minLength={register ? 8 : 1} autoComplete={register ? "new-password" : "current-password"} className="h-12 rounded-md border bg-background px-4 font-normal"/></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}{message && <p role="status" className="rounded-md bg-accent p-4 text-sm text-accent-foreground">{message}</p>}
          <Button type="submit" disabled={busy} className="h-12 font-bold">{register ? <UserPlus/> : <LogIn/>}{busy ? "Aguarde…" : register ? "Criar conta" : "Entrar"}</Button>
        </form>
        <Button variant="link" disabled={busy} onClick={() => { setRegister(!register); setError(""); setMessage(""); }} className="mt-5 px-0">{register ? "Já tenho cadastro" : "Ainda não sou cadastrado"}</Button>
      </>}
    </div></section>
  </div>;
}
