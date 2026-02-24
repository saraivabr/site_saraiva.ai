---
title: "Como Configurar OpenCode com Múltiplos Providers"
slug: "como-configurar-opencode-multiplos-providers"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Tutorial para configurar OpenCode com Claude, GPT-4, Gemini e modelos locais via Ollama. Use o melhor modelo para cada tarefa."
tags: ["opencode", "ollama", "claude", "gpt-4", "tutorial"]
image: ""
source: ""
featured: false
difficulty: "iniciante"
duration: "15 min"
---

# Como Configurar OpenCode com Múltiplos Providers

Uma das maiores vantagens do OpenCode é a flexibilidade de providers. Você pode usar Claude para raciocínio complexo, GPT-4 para código, Gemini para análise de documentos e modelos locais via Ollama para tarefas que exigem privacidade.

Este tutorial mostra como configurar cada provider e alternar entre eles.

## Instalação do OpenCode

```bash
# Via Go (recomendado)
go install github.com/opencode-ai/opencode@latest

# Ou download direto
curl -fsSL https://opencode.ai/install.sh | bash

# Verificar instalação
opencode --version
```

## Configurando Providers

### 1. Anthropic (Claude)

O melhor para raciocínio complexo e código de alta qualidade.

```bash
# Configurar provider
opencode config set provider anthropic

# Adicionar API key
opencode config set anthropic.api-key "sk-ant-..."

# Escolher modelo
opencode config set anthropic.model "claude-sonnet-4-20250514"
```

Modelos disponíveis:
- `claude-opus-4-20250514` — Mais capaz, mais caro
- `claude-sonnet-4-20250514` — Equilíbrio ideal
- `claude-haiku-4-5-20251001` — Rápido e barato

### 2. OpenAI (GPT-4)

Excelente para código e instruções diretas.

```bash
opencode config set provider openai
opencode config set openai.api-key "sk-..."
opencode config set openai.model "gpt-4o"
```

Modelos disponíveis:
- `gpt-4o` — Mais recente, multimodal
- `gpt-4-turbo` — Rápido, bom custo-benefício
- `gpt-4` — Original, mais caro

### 3. Google (Gemini)

Bom para contextos longos e análise de documentos.

```bash
opencode config set provider google
opencode config set google.api-key "AIza..."
opencode config set google.model "gemini-pro"
```

Modelos disponíveis:
- `gemini-ultra` — Máxima capacidade
- `gemini-pro` — Uso geral
- `gemini-flash` — Rápido e barato

### 4. Ollama (Modelos Locais)

Para privacidade total e uso offline.

```bash
# Primeiro, instale Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Baixe um modelo
ollama pull codellama:13b
ollama pull deepseek-coder:6.7b

# Configure OpenCode
opencode config set provider ollama
opencode config set ollama.host "http://localhost:11434"
opencode config set ollama.model "codellama:13b"
```

Modelos recomendados:
- `codellama:13b` — Código geral
- `deepseek-coder:6.7b` — Excelente para código
- `mistral:7b` — Uso geral, rápido
- `llama3:8b` — Versátil

### 5. Azure OpenAI

Para ambientes enterprise.

```bash
opencode config set provider azure
opencode config set azure.endpoint "https://seu-recurso.openai.azure.com"
opencode config set azure.api-key "..."
opencode config set azure.deployment "gpt-4-deployment"
```

## Alternando Entre Providers

### Via Linha de Comando

```bash
# Usar Claude para esta sessão
opencode --provider anthropic

# Usar modelo local
opencode --provider ollama --model codellama:13b

# Usar GPT-4
opencode --provider openai --model gpt-4o
```

### Via Configuração

Crie perfis em `~/.config/opencode/config.yaml`:

```yaml
profiles:
  code:
    provider: anthropic
    model: claude-sonnet-4-20250514
    
  local:
    provider: ollama
    model: codellama:13b
    
  analysis:
    provider: google
    model: gemini-pro

default: code
```

Use com:

```bash
opencode --profile local
opencode --profile analysis
```

## Estratégias de Uso

### Por Tipo de Tarefa

| Tarefa | Provider | Modelo |
|--------|----------|--------|
| Refatoração complexa | Anthropic | Claude Opus |
| Código rápido | Anthropic | Claude Haiku |
| Análise de docs | Google | Gemini Pro |
| Código privado | Ollama | CodeLlama |
| Scripts simples | Ollama | Mistral |

### Por Custo

Se custo é prioridade:

1. **Gratuito**: Ollama (só energia)
2. **Barato**: Claude Haiku, Gemini Flash
3. **Médio**: Claude Sonnet, GPT-4o
4. **Premium**: Claude Opus, GPT-4

### Por Privacidade

Se dados são sensíveis:

1. Use Ollama com modelo local
2. Desative telemetria: `opencode config set telemetry false`
3. Mantenha histórico local apenas

## Configuração Avançada

### Fallback Automático

Configure fallback se o provider principal falhar:

```yaml
provider:
  primary: anthropic
  fallback:
    - openai
    - ollama
    
  retry:
    attempts: 3
    delay: 1000
```

### Rate Limiting

Evite atingir limites de API:

```yaml
rate_limit:
  requests_per_minute: 50
  tokens_per_minute: 100000
```

### Caching

Cache respostas para economizar:

```yaml
cache:
  enabled: true
  ttl: 3600  # 1 hora
  max_size: 100MB
```

## Verificando Configuração

```bash
# Ver configuração atual
opencode config list

# Testar conexão
opencode test-connection

# Ver providers disponíveis
opencode providers
```

## Troubleshooting

### Erro de API Key

```bash
# Verificar se está configurada
opencode config get anthropic.api-key

# Reconfigurar
opencode config set anthropic.api-key "sk-ant-..."
```

### Ollama não conecta

```bash
# Verificar se está rodando
ollama list

# Reiniciar
ollama serve
```

### Modelo não encontrado

```bash
# Listar modelos disponíveis
ollama list  # Para Ollama

# Para outros providers, verifique a documentação
```

## O que fazer agora

1. **Instale OpenCode**: `go install github.com/opencode-ai/opencode@latest`
2. **Configure seu provider principal**: Anthropic recomendado
3. **Instale Ollama para fallback local**: `curl -fsSL https://ollama.com/install.sh | sh`
4. **Crie perfis para diferentes tarefas**: Otimize custo e qualidade
