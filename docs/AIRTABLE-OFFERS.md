# Produtos e Ofertas no site

O Airtable `appuljnt9Q1h2ae18/tbll1rx8926j7o4dI` é a fonte interna. O site nunca consulta essa base no navegador.

## Gate editorial

Somente registros com `Publicar no site` marcado entram na projeção pública. Desmarcar e executar a sincronização despublica a solução no Supabase e transforma sua rota em 404 após a revalidação.

## Campos publicados

- nome;
- tipo de oferta;
- público comprador;
- problema resolvido;
- entrega;
- status público derivado.

Preço, potencial comercial, projeto/repositório de origem, observações e próximo passo não são copiados para a tabela pública.

## Sincronização

```bash
npm run sync:offers
```

O comando exige `AIRTABLE_TOKEN`, `SUPABASE_APP_URL` e `SUPABASE_SERVICE_ROLE_KEY` apenas no ambiente administrativo. Se o gate retornar zero registros, a execução falha por segurança. Para despublicar todos intencionalmente, use `AIRTABLE_OFFERS_ALLOW_EMPTY=true` em uma única execução supervisionada.
