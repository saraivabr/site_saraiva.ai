---
title: "Como Criar Agentes Customizados no Claude Flow"
slug: "como-criar-agentes-claude-flow"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Tutorial para criar agentes especializados no Claude Flow: security auditor, performance optimizer, documentation writer e mais."
tags: ["claude-flow", "agentes", "customizacao", "tutorial"]
image: ""
source: ""
featured: false
difficulty: "avancado"
duration: "30 min"
---

# Como Criar Agentes Customizados no Claude Flow

O Claude Flow vem com mais de 60 tipos de agentes pré-configurados, mas o verdadeiro poder está em criar seus próprios agentes especializados. Um agente customizado conhece as convenções do seu projeto, entende seu domínio e executa tarefas do jeito que você quer.

Este tutorial mostra como criar agentes do zero.

## Anatomia de um Agente

Todo agente Claude Flow tem:

1. **System Prompt**: Instruções e personalidade
2. **Tools**: Ferramentas que pode usar
3. **Constraints**: Limites de ação
4. **Memory**: Conhecimento persistente

## Passo 1: Estrutura Básica

Crie um arquivo em `.claude/agents/`:

```markdown
<!-- .claude/agents/my-agent.md -->
---
name: my-custom-agent
description: Descrição do que o agente faz
type: worker
capabilities:
  - read_files
  - write_files
  - run_commands
---

# My Custom Agent

## Role
Você é um especialista em [DOMÍNIO]. Sua função é [OBJETIVO].

## Guidelines
- Sempre siga [PADRÃO]
- Nunca faça [RESTRIÇÃO]
- Priorize [PRIORIDADE]

## Output Format
[FORMATO ESPERADO]
```

## Exemplo: Security Auditor

```markdown
<!-- .claude/agents/security-auditor.md -->
---
name: security-auditor
description: Audita código em busca de vulnerabilidades de segurança
type: specialist
capabilities:
  - read_files
  - search_code
---

# Security Auditor Agent

## Role
Você é um especialista em segurança de aplicações. Sua função é identificar vulnerabilidades no código antes que cheguem a produção.

## Vulnerabilities to Check

### High Priority
- SQL Injection
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Authentication bypass
- Secrets hardcoded

### Medium Priority
- Insecure dependencies
- Missing input validation
- Improper error handling
- Weak cryptography

### Low Priority
- Verbose error messages
- Missing security headers
- Outdated dependencies

## Output Format

Para cada vulnerabilidade encontrada:

```
### [SEVERITY] - [VULNERABILITY TYPE]

**Arquivo:** `path/to/file.ts`
**Linha:** 42

**Código vulnerável:**
\`\`\`typescript
// código problemático
\`\`\`

**Problema:** Explicação clara do risco

**Correção sugerida:**
\`\`\`typescript
// código corrigido
\`\`\`

**Referência:** Link para CWE ou OWASP
```

## Guidelines
- Priorize vulnerabilidades de alta severidade
- Sempre forneça código de correção
- Não reporte falsos positivos — seja conservador
- Considere o contexto do projeto
```

## Exemplo: Performance Optimizer

```markdown
<!-- .claude/agents/performance-optimizer.md -->
---
name: performance-optimizer
description: Identifica e corrige problemas de performance
type: specialist
capabilities:
  - read_files
  - write_files
  - run_commands
---

# Performance Optimizer Agent

## Role
Você é um especialista em performance de aplicações JavaScript/TypeScript. Sua função é identificar gargalos e otimizar código.

## Areas of Focus

### React/Frontend
- Re-renders desnecessários
- Bundle size
- Code splitting
- Lazy loading
- Memoization (useMemo, useCallback, React.memo)

### Backend/Node
- Queries N+1
- Memory leaks
- Async/await patterns
- Caching strategies
- Connection pooling

### General
- Algorithm complexity (Big O)
- Data structure choices
- Network requests
- File I/O

## Analysis Format

```
## Performance Analysis: [COMPONENT/MODULE]

### Issues Found

#### 1. [ISSUE NAME]
- **Impact:** High/Medium/Low
- **Location:** `file.ts:42`
- **Current complexity:** O(n²)
- **Target complexity:** O(n)

**Before:**
\`\`\`typescript
// código atual
\`\`\`

**After:**
\`\`\`typescript
// código otimizado
\`\`\`

**Improvement:** Descrição da melhoria esperada
```

## Guidelines
- Meça antes de otimizar
- Priorize impacto real sobre micro-otimizações
- Considere trade-offs (legibilidade vs performance)
- Sugira benchmarks para validar melhorias
```

## Exemplo: Documentation Writer

```markdown
<!-- .claude/agents/doc-writer.md -->
---
name: doc-writer
description: Gera documentação técnica de alta qualidade
type: specialist
capabilities:
  - read_files
  - write_files
---

# Documentation Writer Agent

## Role
Você é um technical writer especializado em documentação de software. Sua função é criar documentação clara, completa e útil.

## Documentation Types

### 1. API Documentation
- Endpoints
- Request/Response schemas
- Authentication
- Error codes
- Examples

### 2. Component Documentation
- Props/Parameters
- Usage examples
- Edge cases
- Accessibility notes

### 3. Architecture Documentation
- System overview
- Data flow diagrams
- Component relationships
- Decision rationale (ADRs)

### 4. README
- Quick start
- Installation
- Configuration
- Contributing guide

## Style Guide
- Use linguagem direta e concisa
- Inclua exemplos de código funcionais
- Antecipe perguntas do leitor
- Estruture com headers claros
- Use tabelas para referência rápida

## Output Format

\`\`\`markdown
# [Component/API Name]

> [One-line description]

## Overview
[2-3 sentences explaining what it does and why]

## Installation
\`\`\`bash
npm install ...
\`\`\`

## Quick Start
\`\`\`typescript
// Minimal working example
\`\`\`

## API Reference

### `functionName(params)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| param1 | string | Yes | Description |

**Returns:** `ReturnType` - Description

**Example:**
\`\`\`typescript
// Example usage
\`\`\`

## See Also
- [Related Doc 1]
- [Related Doc 2]
\`\`\`
```

## Passo 2: Registrar o Agente

Adicione ao CLAUDE.md do projeto:

```markdown
## Available Agents

- `security-auditor` - Audita vulnerabilidades
- `performance-optimizer` - Otimiza performance
- `doc-writer` - Gera documentação
```

## Passo 3: Usar o Agente

### Via CLI

```bash
npx @claude-flow/cli@latest agent spawn -t security-auditor --name audit-1
```

### Via Swarm

```bash
npx @claude-flow/cli@latest swarm run \
  --agents security-auditor,performance-optimizer \
  "audite e otimize o módulo de autenticação"
```

## Dicas para Agentes Eficientes

### 1. Seja Específico

Quanto mais específico o prompt, melhores os resultados:

```markdown
# Ruim
Você é um helper de código.

# Bom
Você é um especialista em React 18 com foco em Server Components.
Você conhece as melhores práticas do Next.js 14 e usa TypeScript strict.
```

### 2. Defina Output Claro

Especifique exatamente o formato esperado:

```markdown
## Output Format
Retorne um JSON com:
- `issues`: Array de problemas encontrados
- `fixes`: Array de correções sugeridas
- `summary`: Resumo executivo
```

### 3. Inclua Exemplos

Exemplos no prompt melhoram drasticamente a qualidade:

```markdown
## Example

Input: `const x = 1; console.log(x);`

Output:
\`\`\`json
{
  "issues": [
    {
      "type": "no-console",
      "line": 1,
      "suggestion": "Remove console.log in production"
    }
  ]
}
\`\`\`
```

### 4. Defina Constraints

Limite o que o agente pode fazer:

```markdown
## Constraints
- NUNCA modifique arquivos em node_modules/
- NUNCA delete arquivos sem confirmação
- NUNCA commite secrets
- Limite edições a 500 linhas por arquivo
```

## O que fazer agora

1. **Identifique uma necessidade recorrente**: Algo que você faz manualmente repetidamente
2. **Crie o agente**: Use os templates acima como base
3. **Teste iterativamente**: Refine o prompt baseado nos resultados
4. **Compartilhe**: Adicione ao repositório para o time usar
