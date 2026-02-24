---
title: "Guia Completo para Iniciantes com OpenClaw"
slug: "openclaw-guia-iniciantes"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Aprenda como começar com OpenClaw, seu assistente pessoal de IA open source. Guia passo a passo desde a instalação até os primeiros comandos."
tags: ["openclaw", "tutorial", "iniciante", "ia", "open-source"]
image: ""
source: ""
featured: true
difficulty: "iniciante"
duration: "15 min"
---

# Guia Completo para Iniciantes com OpenClaw

OpenClaw é um assistente pessoal de IA open source que roda no seu computador e se conecta via WhatsApp, Telegram, Discord e mais. Neste guia, você aprenderá tudo que precisa para começar.

## O que é OpenClaw?

OpenClaw é uma solução de IA pessoal que:
- **Roda localmente** no seu Mac ou Linux
- **Conecta via apps de mensagem** (WhatsApp, Telegram, Discord, iMessage)
- **É open source** - você controla o código
- **Preserva privacidade** - seus dados ficam no seu computador
- **Funciona 24/7** - sempre disponível para ajudar

## Requisitos do Sistema

Antes de começar, você precisa de:

### Hardware
- **Mac**: Intel ou Apple Silicon (M1, M2, M3)
- **Linux**: Ubuntu 20.04+, Fedora 35+ ou Debian 11+
- **RAM**: Mínimo 4GB (recomendado 8GB)
- **Disco**: 10GB livres para instalação

### Software
- Node.js 18+ ou superior
- npm ou yarn (gerenciador de pacotes)
- Git (para clonar o repositório)

### Credenciais
- **OpenAI API Key** (para usar ChatGPT)
  - Criar em: https://platform.openai.com/api-keys
  - Custará entre $5-20/mês dependendo do uso

- **Anthropic API Key** (opcional, para usar Claude)
  - Criar em: https://console.anthropic.com/

## Instalação Passo a Passo

### Passo 1: Verificar Pré-requisitos

Abra o terminal e verifique se tem Node.js instalado:

```bash
node --version
# Deve mostrar v18.0.0 ou superior

npm --version
# Deve mostrar 9.0.0 ou superior
```

Se não tiver, instale em: https://nodejs.org/

### Passo 2: Clonar o Repositório

```bash
git clone https://github.com/ruvnet/openclaw.git
cd openclaw
```

### Passo 3: Instalar Dependências

```bash
npm install
# Isso vai baixar e instalar todas as bibliotecas necessárias
```

### Passo 4: Criar Arquivo de Configuração

```bash
cp .env.example .env
```

Abra o arquivo `.env` com seu editor favorito (VS Code, Vim, etc):

```bash
nano .env
# ou
code .env  # Se usar VS Code
```

### Passo 5: Configurar API Keys

No arquivo `.env`, adicione suas chaves de API:

```env
# OpenAI
OPENAI_API_KEY=sk-sua-chave-aqui

# Anthropic (opcional)
ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui

# Seu nome
OWNER_NAME=Seu Nome Aqui
```

### Passo 6: Iniciar o OpenClaw

```bash
npm start
# ou
npm run dev  # Para modo desenvolvimento
```

Você verá mensagens como:
```
✓ OpenClaw iniciado
✓ Conectado ao servidor
✓ Aguardando mensagens...
```

## Primeiro Contato - Onboarding

Parabéns! O OpenClaw está rodando. Agora você precisa conectar via WhatsApp, Telegram ou Discord.

### Conectando via WhatsApp

1. Abra WhatsApp no seu celular
2. Procure pelo contato gerado ou escaneie o QR code
3. Envie uma mensagem: `oi` ou `olá`
4. O OpenClaw responderá com uma mensagem de boas-vindas

### Conectando via Telegram

1. Acesse https://t.me/botfather
2. Crie um novo bot (`/newbot`)
3. Copie o token do bot
4. Adicione em seu `.env`:
```env
TELEGRAM_BOT_TOKEN=seu-token-aqui
```
5. Reinicie: `npm start`
6. Encontre seu bot no Telegram e envie uma mensagem

## Primeiros Comandos

Após conectado, experimente estes comandos:

### Comando 1: Saudação
```
oi OpenClaw
```
**Resposta esperada:** O assistente se apresenta e oferece ajuda.

### Comando 2: Pergunta Simples
```
qual é a capital do Brasil?
```
**Resposta esperada:** Brasília com explicações.

### Comando 3: Resumo de Notícias
```
me resuma as principais notícias de hoje
```
**Resposta esperada:** Principais acontecimentos do dia.

### Comando 4: Criar Tarefa
```
criar tarefa: estudar React até sexta
```
**Resposta esperada:** Tarefa criada com sucesso.

### Comando 5: Listar Tarefas
```
listar minhas tarefas
```
**Resposta esperada:** Lista de todas as tarefas pendentes.

## Dicas para Iniciantes

### 1. Use Comandos Claros
Ao invés de:
```
acho que preciso organizar minhas coisas mas não sei por onde começar
```

Prefira:
```
me ajude a criar um plano para organizar meu dia
```

### 2. Aproveite o Contexto
O OpenClaw lembra de mensagens anteriores na mesma conversa:
```
1. "quero aprender programação"
2. "qual é melhor linguagem para iniciantes?" (ele saberá que é sobre programação)
```

### 3. Use Aliases (Apelidos)
Configure comandos curtos para ações frequentes:
```
!tarefas  → listar minhas tarefas
!resumo   → resumo do dia
!email    → ler emails importantes
```

### 4. Ative Notificações
Configure para receber lembretes importantes:
- Tarefas vencendo
- Emails importantes
- Reuniões próximas

### 5. Revise os Logs
Se algo der errado, verifique o arquivo de log:
```bash
tail -f logs/openclaw.log
```

## Troubleshooting Inicial

### Problema: "Node.js não encontrado"
**Solução:** Instale Node.js em https://nodejs.org/

### Problema: "API Key inválida"
**Solução:** Verifique se copiou corretamente a chave sem espaços extras

### Problema: "Não recebe mensagens"
**Solução:** 
1. Verifique se o terminal está rodando `npm start`
2. Procure por erros nos logs
3. Reinicie com `npm start`

### Problema: "Erro de conexão"
**Solução:**
1. Verifique conexão de internet
2. Reinicie o OpenClaw
3. Tente em outro app de mensagem (Telegram)

## Próximos Passos

Agora que você está rodando o OpenClaw, explore:

1. **Configurar integrações** (Gmail, Google Calendar)
2. **Criar automações** (lembretes automáticos)
3. **Customizar comportamento** (personalidade do assistente)
4. **Documentação completa**: https://openclaw.ai/docs

## Recursos Úteis

- 📚 **Documentação**: https://openclaw.ai/docs
- 💬 **Comunidade**: https://discord.gg/openclaw
- 🐛 **Reportar bugs**: https://github.com/ruvnet/openclaw/issues
- 📖 **Guia avançado**: `/primeiros-passos-openclaw-produtividade`

---

**Dúvidas?** Consulte a [documentação oficial do OpenClaw](https://openclaw.ai) ou a comunidade no Discord!
