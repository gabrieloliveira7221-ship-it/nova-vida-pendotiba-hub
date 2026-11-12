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
- Keep the public church website and the demo management area as separate TanStack routes sharing one visual system, because the deliverable combines public communication and academic system prototyping.
- Treat all current schedules, event names, attendance figures, and member records as labeled demonstration data until the church validates real information.
- The production academic target is Django with MySQL and Docker; this repository provides the interactive frontend prototype because the hosted runtime is TanStack Start.
- Use Lovable Cloud for this prototype's requested persistent database while retaining the separate Django/MySQL academic target, because the hosted runtime does not run Django or MySQL.
- Keep usuario.id_usuario as a plain UUID and treat usuario.cargo as descriptive only, because Cloud disallows this table's direct auth foreign key and editable profile fields must not confer privileges.
- Create usuario rows atomically from an Auth signup trigger using nome and cargo metadata, because email confirmation can leave signup without a browser session able to insert a profile.
- Keep management routes under the client-only _authenticated layout redirecting to /acesso, and use one root auth subscriber, because browser sessions are unavailable during SSR and all reserved screens need the same gate.
