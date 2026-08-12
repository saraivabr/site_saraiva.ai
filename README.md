# Saraiva.AI

Site editorial e catálogo público da Saraiva.AI, construído com Next.js 16, React 19 e Supabase.

## Desenvolvimento

```bash
npm ci
cp .env.example .env.local
npm run dev
```

## Verificação

```bash
npm run lint
npm run typecheck
npm run build
```

O catálogo é lido apenas no servidor, com registros publicados e revalidação curta. A inscrição da newsletter usa uma chave exclusiva do servidor; nunca prefixe a service role com `NEXT_PUBLIC_`.

## Rotas públicas

- `/` — catálogo e busca
- `/content` e `/news` — hub editorial
- `/tool/[slug]`, `/news/[slug]`, `/blog/[slug]` e `/video/[slug]` — detalhes
- `/templates` e `/template/[slug]` — templates
- `/about` — posicionamento da Saraiva.AI

Deploy oficial: Scalingo, aplicação `saraiva-ai`, domínio `https://saraiva.ai`.
