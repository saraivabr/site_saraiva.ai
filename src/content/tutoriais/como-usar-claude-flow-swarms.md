---
title: "Como Usar Swarms no Claude Flow: Guia Prático"
slug: "como-usar-claude-flow-swarms"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Tutorial completo para criar e gerenciar swarms de agentes no Claude Flow. Aprenda a paralelizar tarefas e multiplicar produtividade."
tags: ["claude-flow", "swarms", "tutorial", "automacao"]
image: ""
source: ""
featured: false
difficulty: "intermediario"
duration: "20 min"
---

# Como Usar Swarms no Claude Flow: Guia Prático

Swarms são o recurso mais poderoso do Claude Flow. Em vez de um agente fazendo tudo sequencialmente, você tem múltiplos agentes trabalhando em paralelo, cada um especializado em sua tarefa. O resultado: tarefas que levariam horas são completadas em minutos.

Este tutorial mostra como configurar e usar swarms na prática.

## Pré-requisitos

- Node.js 18+
- Claude API key (Anthropic)
- Claude Flow instalado: `npm install -g @claude-flow/cli`

## Conceitos Básicos

### O que é um Swarm?

Um swarm é um grupo coordenado de agentes trabalhando em uma tarefa maior. Cada swarm tem:

- **Coordinator**: Planeja e distribui subtarefas
- **Workers**: Executam as subtarefas em paralelo
- **Reviewer** (opcional): Valida qualidade

### Topologias

O Claude Flow suporta três topologias:

1. **Hierarchical**: Coordenador central distribui tarefas
2. **Mesh**: Agentes se comunicam diretamente
3. **Hybrid**: Combinação das duas

Para a maioria dos casos, use hierarchical.

## Passo 1: Inicializar Swarm

```bash
# Na raiz do seu projeto
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 6
```

Isso cria a configuração em `.claude-flow/` com:
- Topologia escolhida
- Número máximo de agentes
- Configurações de memória

## Passo 2: Definir a Tarefa

O swarm precisa de uma tarefa clara para decompor. Quanto mais específica, melhor:

```bash
# Tarefa vaga (evite)
npx @claude-flow/cli@latest swarm run "melhore o código"

# Tarefa específica (ideal)
npx @claude-flow/cli@latest swarm run "refatore o módulo de autenticação para usar JWT, adicione testes e atualize a documentação"
```

## Passo 3: Executar Swarm

```bash
npx @claude-flow/cli@latest swarm run "adicione validação de formulários em todos os componentes React do projeto"
```

O que acontece:

1. **Decomposição**: Coordinator analisa a tarefa e cria subtarefas
2. **Assignment**: Subtarefas são atribuídas a workers
3. **Execution**: Workers executam em paralelo
4. **Merge**: Resultados são consolidados
5. **Review**: Reviewer valida (se configurado)

## Passo 4: Monitorar Progresso

```bash
# Ver status em tempo real
npx @claude-flow/cli@latest swarm status

# Ver logs detalhados
npx @claude-flow/cli@latest swarm logs --follow
```

O output mostra:
- Subtarefas em andamento
- Progresso de cada worker
- Erros ou bloqueios

## Exemplo Prático: Adicionar Testes

Vamos usar swarm para adicionar testes a um projeto React:

```bash
# 1. Inicializar swarm
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8

# 2. Executar
npx @claude-flow/cli@latest swarm run "adicione testes unitários com Vitest para todos os hooks em src/hooks/ e todos os componentes em src/components/ui/"
```

O coordinator vai:
1. Listar todos os arquivos em `src/hooks/` e `src/components/ui/`
2. Criar uma subtarefa para cada arquivo
3. Distribuir entre workers (até 8 simultâneos)
4. Cada worker cria o teste correspondente
5. Resultados são validados (build, lint)

Tempo estimado: 5-10 minutos para ~30 arquivos.

## Configurações Avançadas

### Arquivo de Configuração

Edite `.claude-flow/config.yaml`:

```yaml
swarm:
  topology: hierarchical
  maxAgents: 8
  strategy: specialized
  
  coordinator:
    model: claude-opus-4
    maxRetries: 3
    
  workers:
    model: claude-sonnet-4
    timeout: 300000
    
  reviewer:
    enabled: true
    model: claude-sonnet-4
```

### Reserva de Arquivos

Para evitar conflitos quando múltiplos workers editam arquivos:

```bash
# Workers automaticamente reservam arquivos
# Conflitos são detectados e resolvidos
npx @claude-flow/cli@latest swarm run --isolation reservation "..."
```

### Worktrees (Git)

Para isolamento total, cada worker pode usar um git worktree:

```bash
npx @claude-flow/cli@latest swarm run --isolation worktree "..."
```

Mudanças são cherry-picked de volta ao branch principal.

## Dicas para Swarms Eficientes

### 1. Tarefas Paralelas

Divida tarefas em partes que podem rodar simultaneamente:

```bash
# Bom: arquivos independentes
"adicione documentação JSDoc para cada arquivo em src/lib/"

# Ruim: dependências entre tarefas
"refatore o módulo A, depois use o resultado no módulo B"
```

### 2. Limite de Agentes

Mais agentes nem sempre é melhor. 6-8 é o sweet spot para a maioria dos projetos.

### 3. Verificação Automática

Configure verificação pós-execução:

```yaml
swarm:
  verification:
    build: true
    lint: true
    test: true
```

### 4. Memória Compartilhada

Ative semantic memory para workers aprenderem entre si:

```bash
npx @claude-flow/cli@latest memory search "padrões de teste"
```

## Troubleshooting

### Workers Travados

```bash
# Ver status
npx @claude-flow/cli@latest swarm status

# Cancelar swarm
npx @claude-flow/cli@latest swarm cancel

# Limpar estado
npx @claude-flow/cli@latest swarm cleanup
```

### Conflitos de Arquivo

Se dois workers tentam editar o mesmo arquivo:

1. O sistema detecta automaticamente
2. Um worker espera o outro terminar
3. Mudanças são merged (ou conflito reportado)

### Rate Limits

Se atingir rate limits da API:

```yaml
swarm:
  workers:
    concurrency: 3  # Reduzir paralelismo
    delay: 1000     # Delay entre chamadas (ms)
```

## O que fazer agora

1. **Instale Claude Flow**: `npm install -g @claude-flow/cli`
2. **Configure a API key**: Em `.env` ou variável de ambiente
3. **Teste com tarefa simples**: "adicione comentários em src/lib/utils.ts"
4. **Escale gradualmente**: Aumente complexidade conforme ganha confiança
