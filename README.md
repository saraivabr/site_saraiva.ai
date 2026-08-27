# Saraiva.AI

Ambiente de resolução de desafios da Saraiva.AI, construído com Next.js 16, React 19 e OpenAI Responses API. O conteúdo editorial e o catálogo continuam como infraestrutura secundária.

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

`OPENAI_API_KEY` e as chaves do Supabase são usadas somente no servidor. Nunca use o prefixo `NEXT_PUBLIC_` para essas credenciais. Nesta fase, desafios, progresso e artefatos ficam no `localStorage` do navegador.

## Rotas públicas

- `/` — entrada por desafio
- `/desafio` — conversa, artefato e progresso
- `/desafios` — histórico local
- `/perfil` — capacidades demonstradas
- `/content` e `/news` — infraestrutura editorial, fora da navegação principal
- `/about` — posicionamento da Saraiva.AI

Deploy oficial: Scalingo, aplicação `saraiva-ai`, domínio `https://saraiva.ai`.
