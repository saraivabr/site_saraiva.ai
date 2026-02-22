---
title: "10 Prompts para Analise de Dados com IA"
slug: "prompts-analise-dados"
category: "prompts"
date: "2026-02-22"
author: "Saraiva"
description: "Prompts para analisar planilhas, encontrar padroes, gerar relatorios e criar visualizacoes de dados com inteligencia artificial."
tags: ["dados", "analise", "excel"]
image: ""
source: ""
featured: false
---

# 10 Prompts para Analise de Dados com IA

Analisar dados pode ser intimidador, especialmente quando voce nao e especialista em estatistica ou programacao. Estes prompts transformam a IA no seu analista de dados pessoal. Basta colar seus dados ou descrever o contexto para obter insights acionaveis.

## Analise Exploratoria

### 1. Resumo Rapido de Planilha

Use quando receber uma base de dados nova e precisar entender o que tem ali.

```
Analise os dados abaixo e forneca:
1. Resumo geral (quantas linhas, colunas, tipos de dados)
2. Estatisticas descritivas (media, mediana, min, max) para colunas numericas
3. Valores ausentes ou inconsistentes
4. 3 observacoes iniciais mais relevantes
5. 3 perguntas que vale a pena investigar

Dados:
[Cole aqui as primeiras 20-50 linhas da sua planilha ou descreva a estrutura]
```

### 2. Identificacao de Padroes e Tendencias

Para encontrar o que nao e obvio a olho nu nos dados.

```
A partir dos dados abaixo, identifique:
1. Tendencias ao longo do tempo (crescimento, queda, sazonalidade)
2. Correlacoes entre variaveis (quais se movem juntas?)
3. Outliers ou anomalias que merecem investigacao
4. Segmentos ou clusters naturais nos dados
5. Padroes que podem prever comportamento futuro

Contexto: [descreva o negocio e o que os dados representam]
Dados: [cole os dados]
```

### 3. Analise de Coorte

Para entender como diferentes grupos de clientes se comportam ao longo do tempo.

```
Com base nos dados de [vendas/acessos/uso] abaixo, faca uma analise de coorte:
1. Agrupe os usuarios por [mes de cadastro/primeira compra/canal de aquisicao]
2. Calcule a retencao mensal para cada coorte
3. Identifique qual coorte tem melhor retencao e por que
4. Sugira acoes para melhorar a retencao das piores coortes

Periodo: [ex: janeiro a dezembro de 2025]
Dados: [cole os dados]
```

## Relatorios e Apresentacoes

### 4. Relatorio Executivo a Partir de Dados Brutos

Para quando voce precisa transformar numeros em narrativa para a diretoria.

```
Transforme os dados abaixo em um relatorio executivo.
Estrutura:
- Resumo executivo (3 frases)
- KPIs principais com variacao vs periodo anterior
- 3 destaques positivos
- 2 pontos de atencao
- 3 recomendacoes de acao

Publico: [CEO/diretoria/equipe de marketing]
Periodo: [mes/trimestre]
Dados: [cole os dados ou descreva os numeros]

Tom: objetivo e direto. Use porcentagens e numeros absolutos. Maximo 400 palavras.
```

### 5. Narrativa de Dados para Apresentacao

Para criar slides com storytelling a partir dos numeros.

```
Crie a narrativa para uma apresentacao de 10 slides sobre [tema/relatorio].
Para cada slide, forneca:
- Titulo (maximo 6 palavras)
- Mensagem principal (1 frase)
- Dados/numeros de suporte
- Sugestao de grafico ou visual

Os dados sao: [descreva ou cole]
Narrativa: comece pelo resultado mais impactante, depois contextualize, e termine com proximo passo.
```

## Visualizacao de Dados

### 6. Recomendacao de Graficos

Para saber qual tipo de grafico usar para cada situacao.

```
Tenho os seguintes dados: [descreva as colunas e o tipo de dado].
Quero comunicar: [ex: evolucao ao longo do tempo / comparacao entre categorias / distribuicao / correlacao entre variaveis].
Publico: [tecnico / executivo / geral].

Recomende:
1. O melhor tipo de grafico e por que
2. Quais variaveis colocar em cada eixo
3. Cores e destaques sugeridos
4. O titulo ideal para o grafico
5. Uma frase de insight para colocar como subtitulo
```

### 7. Codigo para Graficos em Python

Para gerar visualizacoes programaticamente.

```
Escreva codigo Python usando matplotlib/seaborn para criar um grafico de [tipo] com os seguintes dados:
[descreva ou cole os dados]

Requisitos:
- Titulo e rotulos nos eixos em portugues
- Paleta de cores profissional (nao usar cores padrao)
- Anotacoes nos pontos mais relevantes
- Legenda clara
- Tamanho adequado para apresentacao (12x6 polegadas)
- Salvar como PNG em alta resolucao (300 DPI)
```

## Analise de Negocios

### 8. Analise de Funil de Conversao

Para identificar onde voce esta perdendo clientes ou leads.

```
Analise o funil de conversao abaixo e forneca:

Etapas do funil:
[Ex: Visitantes: 10.000 > Leads: 800 > Qualificados: 200 > Propostas: 80 > Clientes: 25]

Para cada transicao, calcule:
1. Taxa de conversao
2. Comparacao com benchmarks do setor de [seu setor]
3. Qual etapa tem maior oportunidade de melhoria
4. 3 hipoteses para o gargalo principal
5. Acoes concretas para melhorar cada etapa em 20%
```

### 9. Previsao Simples com Base em Historico

Para projetar numeros futuros a partir de dados passados.

```
Com base nos dados historicos abaixo, faca uma previsao para os proximos [3/6/12] meses.
Dados: [cole serie temporal - ex: vendas mensais dos ultimos 24 meses]

Inclua:
1. Projecao otimista, realista e pessimista
2. Fatores de sazonalidade identificados
3. Nivel de confianca da previsao
4. Premissas utilizadas
5. Eventos externos que podem impactar (liste 3)
6. Sugestao de formula no Excel/Google Sheets para replicar
```

### 10. Analise Comparativa (Benchmarking)

Para comparar seus numeros com o mercado ou com periodos anteriores.

```
Compare os seguintes indicadores do meu negocio com benchmarks do setor de [setor]:

Meus dados:
[Liste seus KPIs - ex: CAC, LTV, churn, ticket medio, NPS, taxa de conversao]

Para cada indicador:
1. Classificacao: acima, na media ou abaixo do mercado
2. Benchmark tipico do setor
3. Meta sugerida para os proximos 6 meses
4. Acao prioritaria para melhorar
5. Qual indicador atacar primeiro (priorize por impacto no faturamento)
```

## Dicas de Uso

- **Formate bem os dados antes de colar**: a IA trabalha melhor com dados tabulares claros. Se possivel, cole no formato CSV ou use separadores consistentes.
- **Comece com amostras pequenas**: teste o prompt com 20-50 linhas antes de enviar a base completa. Isso permite ajustar o prompt antes de gastar tokens com a base inteira.
- **Sempre valide os numeros**: a IA pode errar calculos. Use os insights como ponto de partida e confirme os numeros mais importantes manualmente.
- **Peca o raciocinio**: adicione "explique passo a passo como chegou a cada conclusao" para verificar a logica.
- **Itere com perguntas de follow-up**: apos a primeira analise, pergunte "o que mais voce consegue extrair desses dados?" ou "aprofunde o ponto 3".
- **Combine com ferramentas**: peca a IA para gerar formulas de Excel, queries SQL ou codigo Python que voce pode executar nos seus proprios dados para resultados mais precisos.
