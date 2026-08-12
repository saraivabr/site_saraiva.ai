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
