import type { FormEvent, ReactNode } from "react";
import { Status } from "./management-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

/** Classes padrão dos campos de formulário e filtros da área de gestão. */
export const campoClasse = "h-11 w-full rounded-md border bg-background px-3 text-sm";
export const areaTextoClasse = "min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm";

export function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-bold">
      {rotulo}
      {children}
    </label>
  );
}

export function BotaoPrimario({
  children,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function BotaoLink({
  children,
  onClick,
  perigo = false,
}: {
  children: ReactNode;
  onClick: () => void;
  perigo?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-bold hover:underline ${perigo ? "text-secondary" : "text-primary"}`}
    >
      {children}
    </button>
  );
}

export function Aviso({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-md border border-secondary bg-card p-3 text-sm font-bold">
      {children}
    </p>
  );
}

/** Janela com formulário (usada para cadastrar e editar). */
export function JanelaFormulario({
  aberta,
  aoMudar,
  titulo,
  descricao,
  aoEnviar,
  salvando,
  erro,
  children,
}: {
  aberta: boolean;
  aoMudar: (aberta: boolean) => void;
  titulo: string;
  descricao?: string;
  aoEnviar: (evento: FormEvent<HTMLFormElement>) => void;
  salvando: boolean;
  erro: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={aberta} onOpenChange={aoMudar}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          {descricao && <DialogDescription>{descricao}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={aoEnviar} className="grid gap-4">
          {children}
          {erro && <Aviso>{erro}</Aviso>}
          <div className="flex gap-2">
            <BotaoPrimario type="submit" disabled={salvando}>
              {salvando ? "Salvando…" : "Salvar"}
            </BotaoPrimario>
            <button
              type="button"
              onClick={() => aoMudar(false)}
              className="h-10 rounded-md border px-4 text-sm font-bold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Tabela simples com cabeçalho, linhas e mensagem quando está vazia ou carregando. */
export function Tabela({
  colunas,
  carregando,
  vazio,
  children,
}: {
  colunas: string[];
  carregando: boolean;
  vazio: boolean;
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead className="bg-surface text-xs uppercase text-muted-foreground">
          <tr>
            {colunas.map((coluna) => (
              <th key={coluna} className="px-5 py-4">
                {coluna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {carregando ? (
            <tr>
              <td colSpan={colunas.length} className="px-5 py-8 text-center text-sm text-muted-foreground">
                Carregando…
              </td>
            </tr>
          ) : vazio ? (
            <tr>
              <td colSpan={colunas.length} className="px-5 py-8 text-center text-sm text-muted-foreground">
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Etiqueta colorida da situação do atendimento. */
export function StatusAtendimento({ status }: { status: string }) {
  if (status === "realizado") return <Status tone="success">Realizado</Status>;
  if (status === "cancelado") return <Status tone="warning">Cancelado</Status>;
  return <Status>Agendado</Status>;
}
