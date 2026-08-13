# SaraivaOS — Estado atual

Atualizado em: 2026-08-13T03:01:45.504Z

## Projeto

- Nome: Saraiva.AI — site e acervo próprios
- Objetivo: Migrar o conteúdo público para o Supabase Saraiva.AI e reconstruir o site com identidade, experiência e movimento próprios
- Etapa: validacao
- Rota: Airtable Produtos e Ofertas -> gate Publicar no site -> RPC transacional -> Supabase/RLS -> /news + /content + /solution/[slug] -> WhatsApp
- Próximo artefato: Commit corretivo, deploy Scalingo e QA de produção
- Bloqueio: Nenhum

## Evidências

- Observadas: 16
- Fornecidas: 0
- Inferidas: 0
- Hipóteses: 0
- Desconhecidas: 0

## Métodos ativos

- Airtable
- Supabase RPC
- Next.js
- Playwright
- Scalingo

## Ações pendentes

- [ ] Fechar gates P0 do piloto autoral velocidade de resposta — responsável: Fellipe Saraiva + Rastro — prazo: 2026-08-13 — métrica: diferença substancial, proveniência, aprovação humana e CTA real aprovados antes de publicar
- [ ] Integrar Produtos e Ofertas ao site com projeção pública segura — responsável: Codex — prazo: não definido — métrica: Soluções reais aparecem em /news e /content, detalhes abrem, dados internos não vazam e produção passa QA

## Experimentos ativos

- Nenhum.

## Artefatos

- migration: supabase/migrations/202608120002_editorial_catalog.sql — prova: Supabase db push concluído
- migration-script: scripts/migrate-public-catalog.mjs — prova: Importação idempotente e manifesto gerado
- proof: .saraivaos/proof/supabase-public-assets-verification.json — prova: 1267 mídias próprias e zero referências ao Storage de origem
- documentation: docs/AIRTABLE-OFFERS.md — prova: Contrato do gate, campos públicos e operação de sincronização

## Aprendizados recentes

- Publicação derivada de uma fonte operacional deve reconciliar inclusões e despublicações na mesma transação; falha parcial não pode manter uma oferta fora do gate visível. — evidência: Review independente e rollback observado com RPC sync_editorial_offers
