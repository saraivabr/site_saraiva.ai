---
title: "Como Configurar OpenClaw com WhatsApp, Telegram e Discord"
slug: "como-configurar-openclaw-whatsapp-telegram"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Conecte seu OpenClaw a WhatsApp, Telegram, Discord e iMessage. Comparação entre plataformas e guia passo a passo."
tags: ["openclaw", "whatsapp", "telegram", "discord", "configuração"]
image: ""
source: ""
featured: false
difficulty: "iniciante"
duration: "25 min"
---

# Como Configurar OpenClaw com WhatsApp, Telegram e Discord

Conecte seu assistente OpenClaw aos seus aplicativos de mensagem favoritos. Este guia mostra como configurar cada plataforma.

## Comparação das Plataformas

| Plataforma | Facilidade | Estabilidade | Velocidade | Melhor para |
|-----------|-----------|------------|-----------|-----------|
| **Telegram** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡⚡ | Iniciantes, uso pessoal |
| **WhatsApp** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⚡⚡⚡⚡ | Uso diário, contatos |
| **Discord** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⚡⚡⚡⚡ | Comunidades, servidores |
| **iMessage** | ⭐⭐ | ⭐⭐⭐ | ⚡⚡⚡ | Usuários Mac/iPhone |

**Recomendação:** Comece com **Telegram** para testar, depois adicione WhatsApp.

---

## 1. Configurar Telegram (Recomendado)

Telegram é a forma mais fácil de começar!

### Passo 1: Criar Bot no Telegram

1. Abra Telegram (app ou web)
2. Procure por **@BotFather**
3. Envie: `/newbot`
4. Responda as perguntas:
   - Nome do bot: `Meu OpenClaw`
   - Username: `openclaw_bot_SEUNOMEDEUSUARIO` (deve ser único)

### Passo 2: Obter Token do Bot

Após criar o bot, você receberá uma mensagem com:
```
HTTP API:
<token-muito-longo-aqui>
```

**⚠️ IMPORTANTE:** Copie este token e guarde seguro. Você não verá novamente!

### Passo 3: Configurar no OpenClaw

Abra seu arquivo `.env`:

```bash
nano .env
```

Adicione (ou edite):

```env
TELEGRAM_BOT_TOKEN=<cole-seu-token-aqui>
TELEGRAM_ENABLED=true
```

Exemplo completo:
```env
OPENAI_API_KEY=sk-proj-seu-token
TELEGRAM_BOT_TOKEN=123456789:ABCDEfGHIjKLmnoPQRstUVwxyz1234567890
TELEGRAM_ENABLED=true
OWNER_NAME=Seu Nome
```

### Passo 4: Reiniciar OpenClaw

```bash
# Parar (Ctrl+C no terminal onde roda)
Ctrl+C

# Reiniciar
npm start
```

Você deve ver mensagens como:
```
✓ Telegram bot conectado
✓ Aguardando mensagens
```

### Passo 5: Testar

1. Procure por seu bot no Telegram: `@openclaw_bot_SEUNOMEDEUSUARIO`
2. Clique em "Iniciar" ou envie uma mensagem: `oi`
3. O OpenClaw deve responder!

### Troubleshooting Telegram

**"Bot não responde"**
- Verifique se token está correto (sem espaços)
- Confirm que `TELEGRAM_ENABLED=true`
- Reinicie OpenClaw
- Procure por erros nos logs: `tail -f openclaw.log`

**"UnknownError: 404"**
- Token inválido ou expirado
- Crie um novo bot com @BotFather

---

## 2. Configurar WhatsApp

WhatsApp é mais complexo mas muito prático para uso diário.

### Opção A: Usando WhatsApp Business (Mais estável)

Requer conta WhatsApp Business, mas oferece melhor suporte.

#### Passo 1: Criar Conta Facebook Business

1. Acesse: https://business.facebook.com/
2. Crie uma conta (ou use existente)
3. Vá para "Configurações"
4. Procure por "WhatsApp" → "Primeiros passos"

#### Passo 2: Obter Credenciais

Você receberá:
- **Phone Number ID**
- **Business Account ID**
- **Access Token**

#### Passo 3: Configurar no OpenClaw

```env
WHATSAPP_ENABLED=true
WHATSAPP_PHONE_NUMBER_ID=seu-phone-id
WHATSAPP_BUSINESS_ACCOUNT_ID=seu-business-id
WHATSAPP_ACCESS_TOKEN=seu-access-token
```

### Opção B: Usando QR Code (Mais fácil)

Se usar WhatsApp pessoal com QR code:

#### Passo 1: Habilitar no .env

```env
WHATSAPP_ENABLED=true
WHATSAPP_USE_QR_CODE=true
```

#### Passo 2: Iniciar OpenClaw

```bash
npm start
```

Você verá um QR code no terminal:
```
┌─────────────────┐
│   QR Code       │
│   █████████     │
│   █ ███ ████    │
│   █████████     │
│   █████████     │
└─────────────────┘
```

#### Passo 3: Escanear QR Code

1. Abra WhatsApp no celular
2. Vá para Configurações → Computadores conectados
3. Aponte câmera para o QR code
4. Clique em "Conectar"

#### Passo 4: Testar

Envie uma mensagem para si mesmo ou para outro contato. OpenClaw responderá em qualquer conversa!

### Troubleshooting WhatsApp

**"QR code inválido"**
- Feche WhatsApp no navegador
- Escaneie novamente
- Verifique iluminação

**"Sessão expirada"**
- Desconecte: Configurações → Computadores conectados → Desconectar
- Escaneie novo QR code

**"Sem resposta após mensagem"**
- Verifique internet
- Reinicie OpenClaw
- Tente Telegram para testar (para isolar problema)

---

## 3. Configurar Discord

Ótimo para usar em servidores Discord!

### Passo 1: Criar Servidor Discord (opcional)

Se não tiver um servidor, crie:
1. Abra Discord
2. Clique em "+" → "Criar servidor"
3. Nomeie (ex: "Meu OpenClaw")

### Passo 2: Criar Bot no Discord

1. Acesse: https://discord.com/developers/applications
2. Clique em "New Application"
3. Nomeie seu bot: `OpenClaw`
4. Vá para aba "Bot" (esquerda)
5. Clique em "Add Bot"

### Passo 3: Obter Token

Na aba "Bot", você verá um token embaixo de seu avatar.

**⚠️ IMPORTANTE:** Clique em "Reset Token" se precisar de novo.

Copie o token (não compartilhe!).

### Passo 4: Configurar Permissões

1. Vá para aba "OAuth2" (esquerda)
2. Escolha "URL Generator"
3. Selecione escopos:
   - ✅ bot
4. Selecione permissões:
   - ✅ Read Messages/View Channels
   - ✅ Send Messages
   - ✅ Read Message History
5. Copie a URL gerada (embaixo)

### Passo 5: Convidar Bot para Servidor

1. Cole a URL em seu navegador
2. Escolha o servidor
3. Clique em "Autorizar"

Seu bot aparecerá offline no servidor.

### Passo 6: Configurar OpenClaw

```env
DISCORD_ENABLED=true
DISCORD_BOT_TOKEN=seu-token-aqui
```

Exemplo:
```env
DISCORD_BOT_TOKEN=seu_token_aqui_gerado_no_developer_portal
```

### Passo 7: Reiniciar e Testar

```bash
npm start
```

No Discord, seu bot deve aparecer "Online" (verde).

Envie uma mensagem no canal mencionando o bot:
```
@OpenClaw oi
```

Ele deve responder!

### Configuração Avançada - Bot em Múltiplos Servidores

Para permitir que outras pessoas convide seu bot:

1. Vá para OAuth2 → URL Generator (novamente)
2. Escolha escopos: `bot`
3. Permissões necessárias (como acima)
4. Copie URL
5. Compartilhe com outros

Eles podem autorizar seu bot em seus servidores.

### Troubleshooting Discord

**"Bot offline"**
- OpenClaw não está rodando
- Inicie com `npm start`
- Verifique logs para erros

**"Sem permissão para enviar mensagens"**
- Vá para Servidor → Configurações → Funções
- Dê permissão "Enviar mensagens" para @OpenClaw

**"Mensagem não recebe resposta"**
- Verifique que bot está @mencionado
- Ou configure para responder sempre

---

## 4. Configurar iMessage (Para Mac)

Somente disponível em Mac com iMessage ativo.

### Passo 1: Verificar Pré-requisitos

```bash
# Verificar se está em Mac
uname -s
# Deve retornar: Darwin
```

### Passo 2: Configurar no .env

```env
IMESSAGE_ENABLED=true
IMESSAGE_ACCOUNT=seu-apple-id@icloud.com
```

### Passo 3: Autentificar

Primeira vez que roda, você será solicitado a:
1. Entrar na conta Apple
2. Permitir acesso ao iMessage

Após isso, funcionará automaticamente.

### Passo 4: Testar

Envie uma mensagem via iMessage para um contato ou grupo.

**Limitações:**
- Somente em Mac
- Requer Apple ID ativo
- Pode ter delays de sincronização

---

## Usar Múltiplas Plataformas Simultaneamente

Você pode habilitar várias ao mesmo tempo!

### Configuração Completa

```env
# OpenAI
OPENAI_API_KEY=sk-proj-seu-token

# Telegram (recomendado primeiro)
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=seu-token

# WhatsApp (depois de testar)
WHATSAPP_ENABLED=true
WHATSAPP_USE_QR_CODE=true

# Discord (opcional)
DISCORD_ENABLED=true
DISCORD_BOT_TOKEN=seu-token

# Informações
OWNER_NAME=Seu Nome
OWNER_EMAIL=seu-email@example.com
```

Assim, você receberá e responderá mensagens em todas as plataformas!

---

## Gerenciar Respostas por Plataforma

No OpenClaw avançado, você pode ter respostas diferentes por plataforma:

```
Telegram: Respostas rápidas e diretas
WhatsApp: Mais contextuais, lembretes
Discord: Para comunidade/público
```

Veja configuração avançada em `/como-conectar-openclaw-gmail-calendar`.

---

## Dicas de Segurança

1. **Nunca compartilhe tokens** com outras pessoas
2. **Guarde em .env** que está no `.gitignore`
3. **Regenere tokens** se suspeitar que foi comprometido
4. **Não há problema** em ter diferentes tokens por plataforma

---

## Próximas Etapas

✅ Conectado a mensagens
→ [Integrar Gmail e Calendar](/como-conectar-openclaw-gmail-calendar)
→ [Primeiros comandos produtivos](/primeiros-passos-openclaw-produtividade)

---

**Qual plataforma escolher?**
- 🚀 **Começar**: Telegram (mais fácil)
- 📱 **Diário**: WhatsApp (mais comum)
- 👥 **Comunidade**: Discord
- 💬 **Pessoal**: Todos juntos!

Dúvidas? [Comunidade OpenClaw no Discord](https://discord.gg/openclaw)
