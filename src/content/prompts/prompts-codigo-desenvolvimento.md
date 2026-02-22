---
title: "15 Prompts para Codigo e Desenvolvimento"
slug: "prompts-codigo-desenvolvimento"
category: "prompts"
date: "2026-02-22"
author: "Saraiva"
description: "Prompts para code review, debug, refatoracao, testes, documentacao e arquitetura de software com IA."
tags: ["codigo", "programacao", "dev"]
image: ""
source: ""
featured: false
---

# 15 Prompts para Codigo e Desenvolvimento

Desenvolvedores de todos os niveis podem usar IA como um par programmer disponivel 24 horas. Estes prompts cobrem desde debug ate decisoes de arquitetura, ajudando voce a escrever codigo melhor e mais rapido.

## Code Review

### 1. Revisao Completa de Codigo

Para obter feedback detalhado sobre um trecho de codigo antes de fazer merge.

```
Faca uma code review detalhada do codigo abaixo.
Linguagem: [linguagem].
Contexto: [o que o codigo faz].

Avalie os seguintes aspectos:
1. Corretude: o codigo faz o que deveria?
2. Performance: ha gargalos ou operacoes desnecessarias?
3. Legibilidade: nomes, estrutura e organizacao estao claros?
4. Seguranca: ha vulnerabilidades (SQL injection, XSS, etc.)?
5. Tratamento de erros: edge cases estao cobertos?
6. Boas praticas: segue os padroes da linguagem?

Para cada problema encontrado, forneca:
- Linha ou trecho afetado
- Descricao do problema
- Sugestao de correcao com codigo

Codigo:
[Cole o codigo aqui]
```

### 2. Review Focada em Seguranca

Para auditar codigo que lida com dados sensiveis ou autenticacao.

```
Analise o codigo abaixo focando exclusivamente em seguranca.
Linguagem: [linguagem]. Framework: [framework].
Contexto: [ex: endpoint de autenticacao, processamento de pagamento].

Verifique:
1. Injection (SQL, NoSQL, Command, LDAP)
2. Autenticacao e autorizacao
3. Exposicao de dados sensiveis
4. Criptografia adequada
5. Validacao de entrada
6. CSRF/XSS/SSRF
7. Rate limiting
8. Logging de informacoes sensiveis

Para cada vulnerabilidade:
- Severidade (critica/alta/media/baixa)
- Como explorar
- Correcao recomendada com codigo

Codigo:
[Cole o codigo]
```

## Debug

### 3. Diagnostico de Bug

Para quando voce esta preso em um bug e nao encontra a causa.

```
Estou enfrentando o seguinte bug:

Comportamento esperado: [descreva]
Comportamento atual: [descreva]
Mensagem de erro: [cole se houver]
Stack trace: [cole se houver]

Linguagem: [linguagem]. Framework: [framework].
Versoes: [liste versoes relevantes]

Codigo relevante:
[Cole o codigo]

O que ja tentei:
[Liste as tentativas]

Me ajude a:
1. Identificar a causa raiz mais provavel
2. Sugerir 3 hipoteses em ordem de probabilidade
3. Para cada hipotese, fornecer um teste para confirmar/descartar
4. Apresentar a correcao para a causa mais provavel
```

### 4. Leitura e Explicacao de Erro

Para entender mensagens de erro cripticas.

```
Explique o seguinte erro em linguagem simples:

[Cole a mensagem de erro completa ou stack trace]

Linguagem/Framework: [especifique]
Contexto: [o que voce estava tentando fazer]

Inclua:
1. O que o erro significa em portugues simples
2. A causa mais comum desse erro
3. Passo a passo para resolver
4. Como prevenir esse erro no futuro
```

## Refatoracao

### 5. Refatoracao para Clean Code

Para melhorar a qualidade do codigo sem alterar o comportamento.

```
Refatore o codigo abaixo seguindo principios de clean code.
Linguagem: [linguagem].

Aplique:
1. Nomes descritivos para variaveis e funcoes
2. Funcoes pequenas (maximo 20 linhas)
3. Principio de responsabilidade unica
4. Remocao de codigo morto e duplicado
5. Early returns ao inves de ifs aninhados
6. Constantes nomeadas ao inves de magic numbers

Forneca:
- Codigo refatorado completo
- Lista de mudancas feitas e por que
- Antes/depois das partes mais significativas

Codigo original:
[Cole o codigo]
```

### 6. Migracao de Codigo Legado

Para modernizar codigo antigo de forma incremental.

```
Preciso migrar o seguinte codigo de [tecnologia antiga] para [tecnologia nova].

Codigo atual:
[Cole o codigo]

Requisitos:
1. Manter o mesmo comportamento externo
2. Usar padroes modernos de [tecnologia nova]
3. Aproveitar features nativas (ex: async/await, tipos, etc.)
4. Manter compatibilidade com [dependencias que nao mudam]

Forneca:
- Codigo migrado completo
- Mapeamento: funcao antiga > funcao nova
- Testes para validar que o comportamento nao mudou
- Lista de breaking changes (se houver)
```

## Testes

### 7. Geracao de Testes Unitarios

Para criar testes abrangentes de forma rapida.

```
Gere testes unitarios para o codigo abaixo.
Linguagem: [linguagem]. Framework de testes: [jest/pytest/junit/etc.].

Codigo:
[Cole o codigo]

Inclua testes para:
1. Caso de sucesso (happy path)
2. Entradas invalidas (null, undefined, vazio, tipo errado)
3. Edge cases (limites, valores extremos)
4. Comportamento com erro (excecoes, falhas de rede)
5. Casos de fronteira especificos do dominio

Para cada teste: nome descritivo, arrange-act-assert, e comentario breve explicando o que valida.
Mocks: use [biblioteca de mock] para dependencias externas.
```

### 8. Testes de Integracao

Para validar que componentes funcionam juntos.

```
Crie testes de integracao para [modulo/endpoint/feature].
Stack: [linguagem + frameworks].

O que testar:
1. Fluxo completo de [descreva o fluxo]
2. Integracao com [banco/API/servico externo]
3. Autenticacao e autorizacao
4. Tratamento de falhas (timeout, erro 500, dado invalido)

Para cada teste:
- Setup necessario (dados de teste, mocks de servico externo)
- Passos do teste
- Assercoes esperadas
- Cleanup apos o teste

Use [framework de teste de integracao] e documente como rodar localmente.
```

## Documentacao

### 9. Documentacao de API

Para criar docs de API claras e completas.

```
Documente a seguinte API REST:
[Cole o codigo dos endpoints ou descreva]

Para cada endpoint, inclua:
- Metodo HTTP e URL
- Descricao (1 frase)
- Headers obrigatorios
- Parametros (path, query, body) com tipo e obrigatoriedade
- Exemplo de request (curl)
- Exemplo de response (JSON) para sucesso
- Codigos de erro possiveis com mensagem
- Rate limits (se aplicavel)

Formato: Markdown compativel com [Swagger/Redoc/ReadMe].
Inclua uma secao de autenticacao no inicio.
```

### 10. README de Projeto

Para criar um README que realmente ajuda novos desenvolvedores.

```
Crie um README.md para o projeto [nome].
Linguagem: [linguagem]. Tipo: [API/biblioteca/CLI/app].

Secoes:
1. Titulo + descricao (2 frases)
2. Badges (build, coverage, versao)
3. Instalacao (passo a passo)
4. Uso rapido (exemplo minimo funcionando)
5. Configuracao (variaveis de ambiente, arquivo de config)
6. Estrutura do projeto (arvore de diretorios com descricao)
7. Scripts disponiveis (build, test, lint, deploy)
8. Contribuindo (como rodar localmente, padrao de commits)
9. Licenca

Tom: tecnico e direto. Assuma que o leitor e um dev pleno.
```

## Arquitetura

### 11. Decisao de Arquitetura (ADR)

Para documentar decisoes tecnicas importantes.

```
Crie um Architecture Decision Record (ADR) para a seguinte decisao:

Titulo: [ex: Escolha do banco de dados para servico X]
Contexto: [descreva o problema e restricoes]
Opcoes consideradas: [liste 2-4 opcoes]

Para cada opcao, analise:
- Pros (minimo 3)
- Contras (minimo 3)
- Custo estimado de implementacao
- Impacto na escalabilidade
- Curva de aprendizado da equipe

Decisao: recomende a melhor opcao com justificativa.
Consequencias: o que muda apos esta decisao (positivo e negativo).
Formato: ADR padrao (Status, Contexto, Decisao, Consequencias).
```

### 12. Design de Sistema

Para planejar a arquitetura de um novo sistema ou feature.

```
Projete a arquitetura para [sistema/feature].

Requisitos funcionais:
[Liste os requisitos]

Requisitos nao-funcionais:
- Usuarios simultaneos esperados: [numero]
- Latencia aceitavel: [ms]
- Disponibilidade: [99.9%]
- Volume de dados: [estimativa]

Inclua:
1. Diagrama de componentes (descricao textual)
2. Tecnologias recomendadas para cada componente
3. Fluxo de dados entre componentes
4. Estrategia de banco de dados
5. Pontos de cache
6. Estrategia de deploy
7. Monitoramento e alertas
8. Plano de escalabilidade
```

## Performance e Otimizacao

### 13. Analise de Performance

Para identificar e resolver gargalos.

```
Analise o codigo abaixo quanto a performance.
Linguagem: [linguagem]. Contexto: [ex: roda em loop, chamado 1000x/segundo].

Codigo:
[Cole o codigo]

Identifique:
1. Complexidade de tempo (Big O) das operacoes principais
2. Gargalos de performance
3. Alocacoes de memoria desnecessarias
4. Operacoes de I/O que podem ser otimizadas
5. Oportunidades de cache ou memoizacao

Para cada otimizacao sugerida:
- Impacto estimado (alto/medio/baixo)
- Tradeoff (o que se perde)
- Codigo otimizado
```

### 14. Query SQL Otimizada

Para melhorar queries lentas.

```
Otimize a seguinte query SQL:

[Cole a query]

Banco: [PostgreSQL/MySQL/etc.]. Tabelas envolvidas: [descreva o schema relevante].
Volume de dados: [linhas por tabela].
Tempo atual de execucao: [tempo].

Forneca:
1. Analise do plano de execucao provavel
2. Query otimizada
3. Indices recomendados (com CREATE INDEX)
4. Explicacao de cada mudanca
5. Estimativa de melhoria
6. Alternativas se a query nao puder ser otimizada (views materializadas, cache, etc.)
```

### 15. Checklist de Deploy

Para garantir que nada seja esquecido antes de subir para producao.

```
Crie um checklist de deploy para [tipo de aplicacao: API/frontend/mobile/etc.].
Stack: [liste tecnologias].
Ambiente: [AWS/GCP/Heroku/etc.].

Categorias:
1. Pre-deploy (codigo, testes, review)
2. Banco de dados (migrations, backups)
3. Configuracao (env vars, secrets, DNS)
4. Deploy (passos, rollback plan)
5. Pos-deploy (smoke tests, monitoramento)
6. Comunicacao (changelog, notificacao ao time)

Para cada item: descricao + comando ou acao especifica.
Formato: checklist com [ ] para marcar.
```

## Dicas de Uso

- **Sempre forneca contexto**: a IA gera codigo muito melhor quando sabe a linguagem, framework, versao e o que o codigo deve fazer. Nunca cole codigo sem contexto.
- **Peca explicacoes**: adicione "explique cada linha" ou "comente o codigo" quando estiver aprendendo algo novo.
- **Itere**: o primeiro resultado raramente e perfeito. Peca ajustes como "simplifique", "trate esse edge case" ou "use essa biblioteca ao inves".
- **Valide sempre**: nunca copie codigo da IA para producao sem testar. Use os prompts de teste para gerar testes automaticamente.
- **Combine com seu conhecimento**: a IA e um acelerador, nao um substituto. Revise criticamente as sugestoes e questione decisoes que nao fazem sentido para o seu contexto.
- **Mantenha seguranca**: nunca cole credenciais, tokens ou dados sensiveis reais nos prompts. Use dados ficticios ou placeholders.
