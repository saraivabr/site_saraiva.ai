---
title: "Como Conectar OpenClaw a Gmail e Google Calendar"
slug: "como-conectar-openclaw-gmail-calendar"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Integre Google Gmail e Google Calendar ao seu OpenClaw. Leia emails, crie eventos e receba lembretes automáticos."
tags: ["openclaw", "gmail", "google-calendar", "integração", "tutorial"]
image: ""
source: ""
featured: false
difficulty: "intermediário"
duration: "20 min"
---

# Como Conectar OpenClaw a Gmail e Google Calendar

Integre seu Gmail e Google Calendar ao OpenClaw para ler emails, verificar agenda e criar lembretes automáticos.

## O Que Você Conseguirá Fazer

Com essa integração:
- ✉️ Ler emails importantes via chat
- 📅 Verificar sua agenda e compromissos
- ✨ Criar eventos no calendário automaticamente
- ⏰ Receber lembretes de reuniões próximas
- 🔄 Sincronizar tarefas com Google Tasks

---

## Passo 1: Criar Projeto no Google Cloud

### 1.1: Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Você será redirecionado ao dashboard

### 1.2: Criar Novo Projeto

1. No topo, clique no menu de projetos (ao lado de "Google Cloud")
2. Clique em "NOVO PROJETO"
3. Nome: `OpenClaw`
4. Organização: deixe em branco (ou sua organização)
5. Clique em "CRIAR"

⏱️ Pode levar alguns segundos.

### 1.3: Verificar Projeto Ativo

Você deve ver "OpenClaw" selecionado no topo.

---

## Passo 2: Habilitar APIs Necessárias

### 2.1: Abrir Biblioteca de APIs

1. Na barra lateral esquerda, clique em "APIs e Serviços"
2. Clique em "Biblioteca"

### 2.2: Habilitar Gmail API

1. Na busca, digite: `Gmail API`
2. Clique no primeiro resultado
3. Clique no botão azul "ATIVAR"
4. Aguarde a ativação (alguns segundos)

### 2.3: Habilitar Google Calendar API

1. Volte para "Biblioteca" (botão voltar ou menu)
2. Busque: `Google Calendar API`
3. Clique no resultado
4. Clique em "ATIVAR"

### 2.4: Habilitar Google Tasks API (opcional)

1. Procure por: `Tasks API`
2. Clique em "ATIVAR"

---

## Passo 3: Criar Credenciais OAuth 2.0

### 3.1: Acessar Credenciais

1. Na barra lateral, clique em "APIs e Serviços"
2. Clique em "Credenciais"

### 3.2: Criar ID do Cliente

1. Clique no botão azul "+ CRIAR CREDENCIAIS"
2. Escolha "ID do Cliente OAuth"
3. Você verá mensagem: "Para usar o OAuth 2.0, você deve primeiro configurar a tela de consentimento"
4. Clique em "Configurar tela de consentimento"

### 3.3: Configurar Tela de Consentimento

1. Escolha "Usuário externo"
2. Clique em "CRIAR"
3. Preencha o formulário:
   - **Nome do app**: OpenClaw
   - **Email de suporte ao usuário**: seu-email@gmail.com
   - **Informações de contato**: seu-email@gmail.com
4. Clique em "SALVAR E CONTINUAR"

### 3.4: Adicionar Escopos

1. Clique em "ADICIONAR OU REMOVER ESCOPOS"
2. Procure pelos seguintes escopos:
   - `Gmail API` → `gmail`
   - `Google Calendar API` → `calendar`
   - `Tasks API` → `tasks` (opcional)
3. Selecione todos
4. Clique em "ATUALIZAR"
5. Clique em "SALVAR E CONTINUAR"

### 3.5: Adicionar Usuário de Teste

1. Você é o usuário de teste
2. Clique em "ADICIONAR USUÁRIOS"
3. Digite seu email: seu-email@gmail.com
4. Clique em "ADICIONAR"
5. Clique em "SALVAR E CONTINUAR"

### 3.6: Criar Credenciais

Volte para "Credenciais" (você será redirecionado).

1. Clique novamente em "+ CRIAR CREDENCIAIS"
2. Escolha "ID do Cliente OAuth"
3. Tipo: "Aplicativo da Web"
4. Nome: `OpenClaw Local`
5. URIs autorizadas de redirecionamento:
   - `http://localhost:3000/auth/google/callback`
   - `http://127.0.0.1:3000/auth/google/callback`
6. Clique em "CRIAR"

### 3.7: Guardar Credenciais

Uma janela aparecerá com:
- **ID do cliente**
- **Chave secreta do cliente**

**⚠️ IMPORTANTE:**
1. Clique em "JSON" para baixar o arquivo
2. Ou copie ID e chave secreta para um lugar seguro
3. **NUNCA compartilhe a chave secreta!**

---

## Passo 4: Configurar OpenClaw

### 4.1: Adicionar Credenciais ao .env

Abra seu arquivo `.env`:

```bash
nano .env
```

Adicione as credenciais Google:

```env
# Google OAuth
GOOGLE_CLIENT_ID=seu-id-do-cliente.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=sua-chave-secreta
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Habilitar integrações
GMAIL_ENABLED=true
GOOGLE_CALENDAR_ENABLED=true
GOOGLE_TASKS_ENABLED=true
```

### 4.2: Exemplo Completo

```env
# OpenAI
OPENAI_API_KEY=sk-proj-seu-token

# Telegram
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=seu-token

# Google
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-seu-secret-aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GMAIL_ENABLED=true
GOOGLE_CALENDAR_ENABLED=true

# Informações
OWNER_NAME=Seu Nome
OWNER_EMAIL=seu-email@gmail.com
```

---

## Passo 5: Autentificar OpenClaw

### 5.1: Reiniciar OpenClaw

```bash
# Parar (Ctrl+C)
Ctrl+C

# Reiniciar
npm start
```

### 5.2: Abrir Navegador

Abra em seu navegador:
```
http://localhost:3000
```

Você deve ver a interface do OpenClaw.

### 5.3: Conectar Google

1. Procure por um botão "Conectar Google" ou "Autenticar"
2. Clique nele
3. Você será levado a uma página de login Google
4. Selecione sua conta (seu-email@gmail.com)
5. Clique em "Permitir" quando pedido permissão

### 5.4: Confirmar Autorização

Você verá uma mensagem:
```
✓ Google Calendar conectado
✓ Gmail conectado
✓ Autenticado como: seu-email@gmail.com
```

---

## Passo 6: Testar as Integrações

### Teste 1: Ler Emails

No WhatsApp, Telegram ou Discord, envie:
```
leia meus emails
```

Ou:
```
me mostre os últimos 5 emails
```

**Resposta esperada:**
OpenClaw mostrará assunto e remetente dos seus últimos emails.

### Teste 2: Verificar Agenda

```
qual é minha agenda de hoje?
```

Ou:
```
tenho reuniões amanhã?
```

**Resposta esperada:**
OpenClaw listará seus eventos do dia/período.

### Teste 3: Criar Evento

```
crie um evento no calendário: reunião com João amanhã às 10h
```

**Resposta esperada:**
- "✓ Evento criado com sucesso"
- O evento aparecerá no Google Calendar

### Teste 4: Listar Tarefas

```
quais são minhas tarefas?
```

**Resposta esperada:**
Lista de tarefas do Google Tasks.

---

## Comandos Úteis

### Emails

```
ler meus emails
mostrar emails de [pessoa]
procurar email sobre [assunto]
marcar como lido [email]
arquivar [email]
```

### Calendário

```
qual é minha agenda?
tenho reuniões hoje?
criar evento: [descrição]
deletar evento [nome]
qual é a próxima reunião?
```

### Tarefas

```
minhas tarefas
adicionar tarefa: [descrição]
marcar tarefa como feita: [tarefa]
tarefas urgentes
```

---

## Automações Avançadas

### Lembretes Automáticos

Configure para receber avisos antes de reuniões:

No arquivo de configuração avançada:
```
CALENDAR_REMINDER_ENABLED=true
REMINDER_TIME_BEFORE=15  # 15 minutos antes
REMINDER_METHOD=message  # via mensagem (Telegram, WhatsApp)
```

### Resumo Diário

Receba uma sinopse da sua agenda todas as manhãs:

```
DAILY_BRIEFING_ENABLED=true
DAILY_BRIEFING_TIME=08:00
DAILY_BRIEFING_INCLUDE=calendar,important_emails
```

### Notificações de Emails Importantes

Receba alertas apenas de pessoas importantes:

```
IMPORTANT_SENDERS=seu-chefe@company.com,seu-cliente@company.com
IMPORTANT_EMAIL_ALERTS=true
```

---

## Troubleshooting

### Erro: "Invalid Client ID"
- Verifique se copiou corretamente (sem espaços)
- Confirme que está em `.env`, não em outro arquivo
- Reinicie OpenClaw

### Erro: "Redirect URI mismatch"
- Verifique se a URI está exata no Google Cloud:
  - `http://localhost:3000/auth/google/callback`
- Se usar outra porta, atualize em ambos os lugares

### Erro: "Gmail não conectado"
- Confirme que Gmail API está ativada
- Confirme que você autenticou
- Tente desconectar e conectar novamente

### Gmail mostra "Sem emails"
- Verifique se você deu permissão de acesso
- Tente desconectar e reconectar
- Verifique escopo `gmail` ativado

### Calendário não mostra eventos
- Confirme que Google Calendar API está ativada
- Verifique que tem eventos no período (hoje/próximos dias)
- Confirme autenticação

### "Acesso negado" ao ler emails/calendário
1. Vá a https://myaccount.google.com/permissions
2. Procure por "OpenClaw"
3. Se estiver bloqueado, clique em remover e reconecte
4. Autorize novamente

---

## Retirar Permissões (Se Necessário)

Para remover acesso do OpenClaw:

1. Acesse: https://myaccount.google.com/permissions
2. Procure por "OpenClaw"
3. Clique em "Remover acesso"

Ou revogue no Google Cloud:
1. Google Cloud Console
2. APIs e Serviços → Credenciais
3. Clique no ID de cliente
4. Clique em "REVOGAR ACESSO"

---

## Próximas Integrações

Após Gmail e Calendar, experimente:

- 📊 **Google Drive** - Acessar documentos
- 📋 **Google Sheets** - Trabalhar com planilhas
- 💼 **Microsoft Outlook** - Se preferir
- 🔔 **Slack** - Notificações em Slack

Veja documentação avançada no site oficial.

---

## Dicas de Segurança

1. ✅ Guarde `GOOGLE_CLIENT_SECRET` seguro
2. ✅ Não compartilhe com outros
3. ✅ Use `.env` que está em `.gitignore`
4. ✅ Se vazar, regenere em Google Cloud
5. ✅ Revise permissões regularmente

---

## Próximas Etapas

✅ Gmail e Calendar conectados
→ [Primeiros comandos produtivos](/primeiros-passos-openclaw-produtividade)
→ [Documentação oficial OpenClaw](https://openclaw.ai/docs)

Dúvidas? [Comunidade OpenClaw no Discord](https://discord.gg/openclaw)
