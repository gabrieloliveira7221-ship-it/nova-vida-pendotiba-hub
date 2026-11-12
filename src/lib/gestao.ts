import { supabase } from "@/integrations/supabase/client";

/** Data de hoje no formato do banco (AAAA-MM-DD), no fuso do navegador. */
export function hojeISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Primeiro dia do mês atual (AAAA-MM-01). */
export function inicioDoMesISO(): string {
  return `${hojeISO().slice(0, 7)}-01`;
}

/** Converte AAAA-MM-DD em DD/MM/AAAA sem mexer com fuso horário. */
export function formatarData(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.slice(0, 10).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : iso;
}

/** Converte HH:MM:SS em HH:MM. */
export function formatarHora(hora: string | null | undefined): string {
  return hora ? hora.slice(0, 5) : "—";
}

/** Texto vazio vira null, para gravar campos opcionais corretamente no banco. */
export function textoOuNulo(valor: FormDataEntryValue | null): string | null {
  const texto = String(valor ?? "").trim();
  return texto === "" ? null : texto;
}

export function mensagemDeErro(erro: unknown): string {
  if (erro && typeof erro === "object" && "message" in erro && typeof erro.message === "string") {
    return erro.message;
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}

/**
 * Garante que o usuário logado tem uma linha na tabela `usuario`
 * (o responsável por atendimentos e eventos) e devolve o id dele.
 */
export async function garantirUsuario(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Sua sessão expirou. Entre novamente.");
  const conta = data.user;

  const { data: existente, error: erroBusca } = await supabase
    .from("usuario")
    .select("id_usuario")
    .eq("id_usuario", conta.id)
    .maybeSingle();
  if (erroBusca) throw erroBusca;

  if (!existente) {
    const nomeInformado = conta.user_metadata?.["nome"];
    const nome =
      typeof nomeInformado === "string" && nomeInformado.trim() !== ""
        ? nomeInformado.trim()
        : ((conta.email ?? "usuario").split("@")[0] ?? "usuario");
    const { error: erroInsercao } = await supabase
      .from("usuario")
      .insert({ id_usuario: conta.id, nome, email: conta.email ?? "" });
    if (erroInsercao) throw erroInsercao;
  }
  return conta.id;
}
