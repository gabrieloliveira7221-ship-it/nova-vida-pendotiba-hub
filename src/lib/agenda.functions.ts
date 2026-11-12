import { createServerFn } from "@tanstack/react-start";

export type EventoPublico = {
  id_evento: number;
  nome: string;
  data: string;
  horario: string | null;
  local: string | null;
  descricao: string | null;
};

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

/** "2026-11-20" -> { dia: "20", mes: "NOV" } */
export function diaEMes(data: string): { dia: string; mes: string } {
  return { dia: data.slice(8, 10), mes: MESES[Number(data.slice(5, 7)) - 1] ?? "" };
}

/**
 * Próximos eventos para as páginas públicas (Início e Agenda).
 * Roda no servidor: o visitante não precisa estar logado e só recebe os campos públicos do evento.
 */
export const listarEventosPublicos = createServerFn({ method: "GET" }).handler(
  async (): Promise<EventoPublico[]> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const hoje = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(
        new Date(),
      );
      const { data, error } = await supabaseAdmin
        .from("evento")
        .select("id_evento, nome, data, horario, local, descricao")
        .gte("data", hoje)
        .order("data")
        .order("horario")
        .limit(20);
      if (error) throw error;
      return data;
    } catch (erro) {
      console.error("[agenda] Não foi possível carregar os eventos:", erro);
      return [];
    }
  },
);
