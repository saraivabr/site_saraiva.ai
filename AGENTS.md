# Saraiva.AI — instruções para agentes

- Resolva as solicitações de ponta a ponta, validando front-end, back-end, QA e deploy quando estiverem no escopo.
- Registre cada etapa e as evidências no Airtable Saraiva Control Tower.
- Preserve a identidade canônica: Inter, preto/off-white, azul `#0085FE` dominante e verde apenas como acento.
- O catálogo público vem do Supabase apenas pelo servidor e somente com `is_published=true`.
- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no cliente nem versione dumps, perfis, e-mails ou outros dados privados.
- O WhatsApp oficial é `5511988642668`.
- Diferencie sempre prova local, canário e produção.

## Comandos obrigatórios antes do deploy

```bash
npm run lint
npm run typecheck
npm run build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
