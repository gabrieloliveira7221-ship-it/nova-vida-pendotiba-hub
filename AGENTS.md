<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture
- Keep the public church website and the management area as separate TanStack routes sharing one visual system.
- Management pages read and write the real PostgreSQL tables (usuario, bairro, pessoa, tipo_atendimento, atendimento, evento); do not reintroduce hard-coded sample data.
- Public pages read events only through the server function in src/lib/agenda.functions.ts, which returns public event fields; visitors never get direct table access.
- Keep usuario.id_usuario as a plain UUID created by the signup trigger, and treat usuario.cargo as descriptive only.
- Keep management routes under the client-only _authenticated layout redirecting to /acesso.
- The Django back-end in backend/ mirrors the same data model (same table and column names); keep both in sync when the model changes.
