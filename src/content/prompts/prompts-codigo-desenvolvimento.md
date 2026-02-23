---
title: "Como Usar IA para Escrever Código Melhor: A Jornada do Dev que Para de Copiar Prompts"
slug: "prompts-codigo-desenvolvimento"
category: "prompts"
date: "2026-02-22"
author: "Saraiva"
description: "Aprenda a pensar com IA para código: debug, refatoração, testes e arquitetura. Não é lista de prompts — é o raciocínio que transforma um dev junior em senior."
tags: ["codigo", "programacao", "dev"]
image: ""
source: ""
featured: false
---

# Como Usar IA para Escrever Código Melhor: A Jornada do Dev que Para de Copiar Prompts

O Lucas é dev pleno numa fintech em São Paulo. Salário de R$ 9.000, squad de 5 pessoas, sprint de duas semanas. Toda segunda-feira ele abre o ChatGPT e cola código com um "me ajuda a debugar isso". A resposta vem genérica. Ele ajusta na mão, perde 40 minutos, e no final resolve do jeito que já sabia.

Na sexta passada, o tech lead dele rejeitou um PR com 14 comentários. Metade eram coisas que a IA deveria ter pego — variável sem tratamento de null, query N+1, teste sem edge case. O Lucas tinha usado IA o sprint inteiro. Mas usou errado.

Eu sei disso porque fui o Lucas por muito tempo.

## Por que copiar prompts de código não funciona

Você abre uma lista de "50 prompts para devs", copia um genérico de code review, cola seu código, e recebe de volta um textão que mistura observações óbvias com sugestões que não se aplicam ao seu contexto.

O problema não é a IA. É que **prompt de código sem contexto é como pedir conselho médico sem dizer o sintoma**. A IA não sabe se seu código roda em produção com 10 mil requests por segundo ou num script que executa uma vez por mês. Não sabe se sua equipe usa TypeScript strict ou JavaScript solto. Não sabe se o PR vai ser revisado por um senior exigente ou se é projeto pessoal.

O dev que tira valor real da IA não copia prompts. Ele entende o **princípio** por trás de cada interação e adapta em tempo real.

## O princípio: IA como par programmer, não como oráculo

Pense na IA como um colega de equipe muito rápido, com memória enciclopédica, mas que acabou de entrar no projeto. Ele não conhece seu codebase, não sabe suas convenções, não entende o domínio do negócio.

Se você pede "revisa esse código", ele vai dar uma resposta genérica — do mesmo jeito que um dev novo daria. Mas se você diz "esse endpoint processa pagamento via Pix, precisa estar em conformidade com o Banco Central, roda em Node 20 com Fastify, e o último incidente foi um timeout na integração com a API do banco", a resposta muda completamente.

O modelo mental é: **quanto mais contexto específico você dá, mais a resposta se aproxima da de um senior que conhece seu projeto**.

A jornada abaixo não é uma lista. É uma sequência que espelha o fluxo real de trabalho de um desenvolvedor — do debug urgente à decisão de arquitetura.

## A jornada: do bug de segunda-feira à arquitetura de sexta

### Etapa 1 — O bug que trava tudo

Segunda-feira, 9h. Deploy de sexta quebrou algo. Os logs mostram um erro que você não entende.

**Prompt:**

```
Estou debugando um erro em produção. O sistema é uma API REST em Node.js 20 com Fastify 4, TypeScript strict, PostgreSQL 15. O serviço processa webhooks de pagamento do Stripe.

Erro no log:
TypeError: Cannot read properties of undefined (reading 'payment_intent')

Stack trace:
  at processWebhook (/src/webhooks/stripe.ts:47)
  at Layer.handle (/node_modules/fastify/lib/layer.js:95)

O erro começou após o deploy de sexta. A única mudança foi atualizar o SDK do Stripe de 14.x para 15.x.

O que já tentei:
1. Reverter o deploy (não é opção, tem migration de banco junto)
2. Checar se o campo mudou de nome na v15 (não achei na changelog)

Me dê: causa raiz provável, como confirmar, e fix mínimo para parar o sangramento.
```

**Por que funciona:** Você deu a stack completa, a versão exata, o contexto do que mudou, e o que já tentou. A IA não vai sugerir "verifique se o campo existe" — ela vai direto para a breaking change do SDK do Stripe entre v14 e v15, provavelmente a mudança de `payment_intent` para `paymentIntent` na nova versão.

**Output esperado:** A IA vai identificar que o Stripe SDK v15 mudou a serialização de snake_case para camelCase, mostrar a linha exata para corrigir, e sugerir um adapter temporário enquanto você migra o resto do código.

**Variação:** Se o erro for intermitente, adicione "acontece em ~30% dos requests, sem padrão óbvio de horário" — isso muda completamente a direção do diagnóstico (provavelmente race condition ou timeout parcial).

### Etapa 2 — Entendendo o código que você não escreveu

O bug foi resolvido, mas você percebe que o módulo de webhooks é um espaguete que ninguém documenta há 2 anos.

**Prompt:**

```
Preciso entender esse módulo antes de refatorar. É o handler de webhooks do Stripe no nosso sistema de pagamentos. Eu não escrevi esse código e o autor saiu da empresa.

Linguagem: TypeScript, Fastify.

Para esse código, me explique:
1. Fluxo de dados: de onde vem o request até onde o dado é persistido
2. Decisões implícitas: por que o autor provavelmente fez X ao invés de Y
3. Armadilhas: o que pode quebrar se eu mexer sem entender
4. Dependências ocultas: efeitos colaterais, estado compartilhado, ordem importa?

Código:
[Cole o código do módulo inteiro, até 200 linhas]
```

**Por que funciona:** A maioria dos devs pede "explica esse código" e recebe uma paráfrase linha por linha. Ao pedir decisões implícitas e armadilhas, você força a IA a fazer análise de risco — que é o que um senior faz quando herda código.

**Output esperado:** Um mapa mental do módulo com os pontos quentes marcados. "A função `retryPayment` na linha 89 usa recursão sem limite — se o Stripe retornar 500 consistentemente, vai estourar a stack." Esse tipo de insight.

### Etapa 3 — Code review que pega o que humano não pega

Agora você vai mexer no código. Antes de abrir PR, passa pela IA.

**Prompt:**

```
Faça code review do diff abaixo como se fosse um tech lead senior de fintech. O código lida com processamento de pagamentos — bugs aqui significam perda de dinheiro real.

Stack: TypeScript strict, Fastify 4, Prisma 5, PostgreSQL 15.
Convenções do time: early returns, funções < 20 linhas, erros tipados com classe customizada.

Foque em:
1. Corretude: tem caso onde pagamento pode ser processado duas vezes?
2. Concorrência: e se dois webhooks do mesmo pagamento chegam ao mesmo tempo?
3. Tratamento de falha: se o banco cai no meio da transação, o que acontece?
4. Tipo: algum cast implícito ou any escondido?

Para cada problema, classifique: blocker / warning / nit.
Só me mostre blockers e warnings.

Diff:
[Cole o diff do git]
```

**Por que funciona:** Você deu um **persona** (tech lead de fintech), um **risco** (dinheiro real), **convenções** do time, e **categorias** de severidade. A IA não vai perder tempo com "considere renomear essa variável" — vai direto nos problemas que causam incidentes.

**Output esperado:** "BLOCKER: Linhas 23-31 — a verificação de idempotência usa `findFirst` sem lock. Se dois webhooks chegam em 50ms de diferença, ambos passam na verificação e o pagamento é creditado duas vezes. Fix: usar `SELECT ... FOR UPDATE` ou advisory lock do PostgreSQL."

**Variação:** Para código de frontend, troque o foco para "acessibilidade, performance de rendering, e memory leaks em useEffect".

### Etapa 4 — Segurança como hábito, não como auditoria

Revisou lógica, agora revisemos segurança. Dois prompts separados porque o foco muda.

**Prompt:**

```
Auditoria de segurança do endpoint abaixo. Contexto: API de fintech, dados bancários reais, usuários PF e PJ, compliance Banco Central.

Endpoint: POST /api/v1/transfers
Auth: JWT Bearer token (RS256)
Input: body JSON com valor, conta destino, descrição

Verifique contra OWASP Top 10 2021 + CWE Top 25:
- Injection (SQL, NoSQL, command)
- Broken auth / broken access control
- Mass assignment
- Rate limiting / DDoS
- Logging de dados sensíveis (CPF, conta, valor)
- IDOR (posso transferir da conta de outro usuário?)

Severidade: Crítica / Alta / Média
Só liste Crítica e Alta. Para cada uma, mostre o exploit e o fix com código.

Código:
[Cole o código do endpoint]
```

**Por que funciona:** Você não pediu "verifique segurança" — listou os vetores de ataque relevantes para o domínio (fintech) e pediu exploit + fix. A IA vai tentar quebrar seu código, não só descrevê-lo.

**Output esperado:** "CRÍTICA — IDOR: O endpoint extrai `accountId` do body do request (linha 12) ao invés do JWT. Qualquer usuário autenticado pode transferir da conta de outro. Fix: `const accountId = request.user.accountId` ao invés de `request.body.accountId`."

### Etapa 5 — Testes que testam de verdade

O código está revisado e seguro. Hora de testar. Mas não qualquer teste — testes que pensam como testador.

**Prompt:**

```
Gere testes para a função transferFunds abaixo. Framework: Vitest + Prisma (mock com @prisma/client/testing).

Regras do negócio que os testes DEVEM cobrir:
1. Transferência só ocorre se saldo >= valor + taxa (0,5% para PF, 0,2% para PJ)
2. Valor mínimo: R$ 1,00. Máximo: R$ 50.000 por transação
3. Limite diário: R$ 200.000 por conta
4. Horário: transferências > R$ 5.000 só processam em dia útil entre 8h-17h BRT
5. Conta destino deve existir e estar ativa

Quero testes para:
- Happy path PF e PJ
- Cada regra violada individualmente
- Combinações perigosas (saldo exato no limite, transferência às 17:00:00 BRT, feriado nacional)
- Concorrência (duas transferências simultâneas que estouram o limite)

Padrão: describe > it, arrange-act-assert, mocks explícitos, nomes em português.

Código:
[Cole a função]
```

**Por que funciona:** Ao listar as regras de negócio explicitamente, você transformou a IA num testador de domínio. Ela não vai gerar testes genéricos de "null input" — vai gerar testes que refletem cenários reais. A combinação "saldo exato no limite" é o tipo de edge case que causa bugs em produção.

**Output esperado:** 15-20 testes organizados por regra, incluindo um teste de "transferência de R$ 50.000,00 às 17:00:00 BRT na sexta-feira de Carnaval" — que é exatamente o tipo de cenário que passa no QA e falha em produção.

### Etapa 6 — Refatoração sem medo

Os testes passam. Hora de limpar o código legado que você herdou na Etapa 2.

**Prompt:**

```
Refatore o módulo abaixo. As restrições são rígidas — este código está em produção e qualquer mudança de comportamento é um bug.

Regras:
1. Manter TODOS os testes existentes passando sem modificação
2. Manter a mesma interface pública (exports, parâmetros, tipos de retorno)
3. Aplicar: early returns, funções < 20 linhas, nomes descritivos em inglês
4. Extrair: validação para camada separada, queries para repository, erros para classes tipadas
5. Eliminar: any, type assertions, código morto, console.log

Entregue:
- Código refatorado com os mesmos exports
- Lista de cada mudança e justificativa em 1 frase
- Riscos: "mudei X, que PODERIA mudar comportamento se Y"

Código original (147 linhas):
[Cole o código]
```

**Por que funciona:** A restrição "manter testes passando sem modificação" é a âncora. A IA não vai reescrever do zero — vai refatorar incrementalmente, que é o que fazemos em código de produção. E a lista de riscos te dá o mapa para testar manualmente o que os testes automatizados podem não cobrir.

**Output esperado:** Código dividido em 3 arquivos (handler, validator, repository), cada função com menos de 20 linhas, zero `any`, e uma lista de 3-4 riscos como "extraí a validação de horário para `isBusinessHour()` — se o timezone do server mudar, a lógica quebra".

### Etapa 7 — A query que trava o banco

Quarta-feira. O DBA manda no Slack: "tem uma query consumindo 80% da CPU do banco". É sua.

**Prompt:**

```
Query lenta em produção. PostgreSQL 15, tabela transactions com 12M de linhas, ~50k inserts/dia.

Query atual (executa em 4.2s, deveria ser < 100ms):

SELECT t.*, u.name, u.email
FROM transactions t
JOIN users u ON u.id = t.user_id
WHERE t.status = 'completed'
  AND t.created_at > NOW() - INTERVAL '30 days'
  AND t.amount > 1000
ORDER BY t.created_at DESC
LIMIT 50;

Índices existentes:
- transactions_pkey (id)
- transactions_user_id_idx (user_id)
- transactions_status_idx (status)

EXPLAIN ANALYZE:
[Cole o output do EXPLAIN]

Me dê:
1. Por que está lento (análise do plano)
2. Query otimizada
3. Índices para criar (com CREATE INDEX exato)
4. Se não der pra otimizar só com índice, alternativas (materialized view, partitioning, cache)
```

**Por que funciona:** Você deu volume de dados (12M linhas), índices existentes, e o EXPLAIN ANALYZE. A IA pode fazer análise real ao invés de chutar. Provavelmente vai sugerir um índice composto em `(status, created_at, amount)` que cobre a query inteira.

**Output esperado:** "O índice `transactions_status_idx` filtra 12M para ~4M (33% são completed). Depois faz sequential scan nos 4M para filtrar por data e valor. Solução: `CREATE INDEX idx_transactions_fast ON transactions (status, created_at DESC, amount) INCLUDE (user_id);` — transforma em index-only scan, estimativa < 50ms."

### Etapa 8 — Decisão de arquitetura documentada

Sexta-feira. O time precisa decidir: microserviços ou monolito para o novo módulo de empréstimos.

**Prompt:**

```
Preciso de um ADR (Architecture Decision Record) para a seguinte decisão:

Contexto: Fintech com 50k usuários ativos, time de 12 devs (3 squads), monolito Node.js atual com 180k LOC. Queremos adicionar um módulo de empréstimos pessoais com análise de crédito, simulação, contratação e cobrança.

Opções:
A) Módulo dentro do monolito atual
B) Microserviço separado com comunicação via eventos (RabbitMQ)
C) Módulo separado com Modular Monolith (bounded context no mesmo deploy)

Para cada opção analise com dados concretos:
- Custo de implementação (semanas-dev)
- Custo de infraestrutura mensal (estimativa em BRL)
- Complexidade operacional (deploy, monitoramento, debug)
- Escalabilidade independente
- Impacto se der errado (rollback, incidentes)

Considere que: o time nunca operou microserviços, a infra atual é Heroku, e o módulo precisa estar em produção em 3 meses.

Formato: ADR padrão (Status, Contexto, Decisão, Consequências).
```

**Por que funciona:** Você deu as restrições reais — time inexperiente em microserviços, deadline de 3 meses, infra simples. A IA não vai recomendar Kubernetes com service mesh. Vai provavelmente recomendar Modular Monolith (opção C) com um plano de extração futura.

**Output esperado:** Um ADR completo recomendando opção C, com argumento central "o time ganha 80% do benefício de microserviços (bounded contexts, contrato explícito entre módulos) sem a complexidade operacional, e mantém a opção de extrair para serviço separado quando o volume justificar (estimativa: > 500k transações/mês)."

## Como montar seu próprio sistema

O padrão que conecta todos esses prompts é uma fórmula de 4 elementos:

1. **Contexto técnico específico** — linguagem, framework, versão, volume, infra
2. **Restrição de domínio** — o que torna SEU problema diferente do genérico
3. **Resultado com formato** — não peça "me ajuda", peça o formato exato (diff, ADR, teste, SQL)
4. **Critério de qualidade** — o que separa resposta boa de ruim (severidade, riscos, tradeoffs)

Salve esse template e preencha para qualquer situação:

```
Contexto: [stack completa + versões + volume]
Domínio: [o que torna esse caso especial]
Tarefa: [o que você quer, com formato de saída]
Qualidade: [como julgar se a resposta é boa]
Código/dados: [cole aqui]
```

Com esse sistema, cada interação com a IA vira uma consulta de alto nível ao invés de um tiro no escuro.

## Resultado: o antes e o depois

**Antes (Lucas genérico):**
- Cola código sem contexto → resposta genérica → 40 min ajustando na mão
- PR rejeitado com 14 comentários → retrabalho de 2 dias
- Testes cobrem happy path → bug em produção na primeira edge case
- Query lenta → "adiciona índice" sem saber qual → continua lenta
- Decisão de arquitetura → opinião de quem gritou mais na reunião

**Depois (Lucas com sistema):**
- Prompt com contexto completo → resposta aplicável direto → 5 min de ajuste
- Code review pela IA antes do PR → 2-3 comentários no máximo, todos são melhorias opcionais
- Testes cobrem regras de negócio + edge cases + concorrência → 0 bugs em produção no último mês
- Query com EXPLAIN + volume + índices → solução em 10 min, DBA aprovou sem mudança
- ADR documentado com tradeoffs reais → decisão em 1 reunião de 30 min

A diferença não é a IA. É o que você dá para ela trabalhar. Dev que trata IA como par programmer experiente — dando contexto, restrições e critérios — produz em 4 horas o que antes levava 2 dias. E o código é melhor.

Não porque a IA é mágica. Porque ela te força a pensar antes de escrever.
