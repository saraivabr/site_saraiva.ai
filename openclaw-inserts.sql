-- Inserir artigos OpenClaw no Supabase
-- Execute este SQL no Supabase SQL Editor

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'Como Conectar OpenClaw a Gmail e Google Calendar',
  'Integre Google Gmail e Google Calendar ao seu OpenClaw. Leia emails, crie eventos e receba lembretes automáticos.',
  '
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
',
  'tool',
  ARRAY['openclaw', 'gmail', 'google-calendar', 'integração', 'tutorial'],
  false,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'Como Configurar OpenClaw com WhatsApp, Telegram e Discord',
  'Conecte seu OpenClaw a WhatsApp, Telegram, Discord e iMessage. Comparação entre plataformas e guia passo a passo.',
  '
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
',
  'tool',
  ARRAY['openclaw', 'whatsapp', 'telegram', 'discord', 'configuração'],
  false,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'Como Criar Skills no OpenClaw',
  'Guia completo para desenvolver Skills customizadas no OpenClaw, seu assistente de IA pessoal. Aprenda a estrutura, publicação e integração com APIs externas.',
  '
# Como Criar Skills no OpenClaw

O OpenClaw é mais poderoso quando você estende suas capacidades com **Skills customizadas**. Este tutorial te guia através de todo o processo de desenvolvimento, publicação e integração com APIs externas.

## O que são Skills?

Skills são extensões modulares que adicionam novas funcionalidades ao OpenClaw. Pense nelas como "superpoderes" que seu assistente de IA adquire:

- **Buscar informações** de APIs externas em tempo real
- **Automatizar tarefas** específicas do seu workflow
- **Integrar serviços** como Notion, Obsidian, GitHub
- **Processar dados** customizados
- **Executar ações** no mundo real

Uma Skill bem desenvolvida é **reutilizável**, **documentada** e **publicável** na comunidade.

## Estrutura de uma Skill

Toda Skill OpenClaw segue uma estrutura padrão:

```
minha-skill/
├── skill.json           # Metadados e configuração
├── skill.js             # Lógica principal
├── README.md            # Documentação
├── examples/            # Exemplos de uso
│   └── exemplo-basico.js
└── tests/               # Testes unitários
    └── skill.test.js
```

### skill.json - Configuração

```json
{
  "name": "minha-skill",
  "version": "1.0.0",
  "description": "Uma skill awesome para OpenClaw",
  "author": "Seu Nome",
  "license": "MIT",
  "commands": [
    {
      "name": "buscar",
      "description": "Busca informações",
      "params": {
        "query": {
          "type": "string",
          "required": true,
          "description": "O que buscar"
        }
      }
    }
  ],
  "config": {
    "api_key": {
      "type": "string",
      "required": false,
      "description": "Chave de API opcional"
    }
  },
  "permissions": ["read", "write", "network"],
  "memory": {
    "enabled": true,
    "namespace": "minha-skill"
  }
}
```

### skill.js - Implementação

```javascript
class MinhaSkill {
  constructor(config = {}) {
    this.config = config;
    this.name = ''minha-skill'';
  }

  // Comando principal
  async buscar(params) {
    const { query } = params;
    
    if (!query) {
      throw new Error(''Query é obrigatória'');
    }

    try {
      // Sua lógica aqui
      const resultado = await this.processarBusca(query);
      return {
        sucesso: true,
        dados: resultado,
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  // Métodos auxiliares
  async processarBusca(query) {
    // Implementar lógica de busca
    return { query, resultado: ''dados processados'' };
  }

  // Hook de inicialização
  async init() {
    console.log(''MinhaSkill inicializada'');
  }

  // Hook de limpeza
  async cleanup() {
    console.log(''MinhaSkill finalizada'');
  }
}

module.exports = MinhaSkill;
```

## Criando Sua Primeira Skill

Vamos criar uma Skill simples que busca cotações de criptomoedas:

### Passo 1: Setup Inicial

```bash
mkdir crypto-price-skill
cd crypto-price-skill
npm init -y
npm install axios
```

### Passo 2: Criar skill.json

```json
{
  "name": "crypto-price",
  "version": "1.0.0",
  "description": "Busca preços de criptomoedas em tempo real",
  "author": "Seu Nome",
  "license": "MIT",
  "commands": [
    {
      "name": "preco",
      "description": "Busca o preço de uma criptomoeda",
      "params": {
        "moeda": {
          "type": "string",
          "required": true,
          "description": "Moeda (BTC, ETH, SOL, etc)"
        },
        "moeda_base": {
          "type": "string",
          "default": "USD",
          "description": "Moeda para comparação"
        }
      }
    },
    {
      "name": "top10",
      "description": "Mostra as top 10 criptomoedas"
    }
  ],
  "memory": {
    "enabled": true,
    "namespace": "crypto-prices"
  }
}
```

### Passo 3: Implementar skill.js

```javascript
const axios = require(''axios'');

class CryptoPriceSkill {
  constructor(config = {}) {
    this.config = config;
    this.name = ''crypto-price'';
    this.api_url = ''https://api.coingecko.com/api/v3'';
  }

  async preco(params) {
    const { moeda = ''bitcoin'', moeda_base = ''usd'' } = params;
    
    try {
      const response = await axios.get(
        `${this.api_url}/simple/price`,
        {
          params: {
            ids: moeda.toLowerCase(),
            vs_currencies: moeda_base.toLowerCase(),
            include_market_cap: true,
            include_24hr_vol: true
          }
        }
      );

      const dados = response.data[moeda.toLowerCase()];
      
      if (!dados) {
        return {
          sucesso: false,
          erro: `Moeda "${moeda}" não encontrada`
        };
      }

      const preco_chave = moeda_base.toLowerCase();
      
      return {
        sucesso: true,
        moeda: moeda.toUpperCase(),
        dados: {
          preco: `${preco_chave.toUpperCase()} ${dados[preco_chave]}`,
          market_cap: dados[`${preco_chave}_market_cap`],
          volume_24h: dados[`${preco_chave}_24h_vol`],
          timestamp: new Date().toISOString()
        }
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  async top10(params) {
    try {
      const response = await axios.get(
        `${this.api_url}/coins/markets`,
        {
          params: {
            vs_currency: ''usd'',
            order: ''market_cap_desc'',
            per_page: 10,
            page: 1,
            sparkline: false
          }
        }
      );

      return {
        sucesso: true,
        top_10: response.data.map((coin, idx) => ({
          posicao: idx + 1,
          nome: coin.name,
          simbolo: coin.symbol.toUpperCase(),
          preco: `$${coin.current_price}`,
          market_cap_rank: coin.market_cap_rank
        }))
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  async init() {
    console.log(''CryptoPriceSkill inicializada'');
  }

  async cleanup() {
    console.log(''CryptoPriceSkill finalizada'');
  }
}

module.exports = CryptoPriceSkill;
```

### Passo 4: Criar Exemplo de Uso

Crie `examples/exemplo-basico.js`:

```javascript
const CryptoPriceSkill = require(''../skill'');

(async () => {
  const skill = new CryptoPriceSkill();
  
  // Buscar preço do Bitcoin
  const bitcoin = await skill.preco({ 
    moeda: ''bitcoin'' 
  });
  console.log(''Bitcoin:'', bitcoin);

  // Buscar top 10
  const top = await skill.top10({});
  console.log(''Top 10:'', top);
})();
```

## Skills com APIs Externas

Muitas APIs requerem autenticação. Aqui está o padrão recomendado:

### Usando Variáveis de Ambiente

```javascript
class MinhaSkillComAuth {
  constructor(config = {}) {
    this.api_key = process.env.MINHA_SKILL_API_KEY || config.api_key;
    
    if (!this.api_key) {
      throw new Error(
        ''API_KEY não configurada. '' +
        ''Configure MINHA_SKILL_API_KEY como variável de ambiente.''
      );
    }
  }

  async fazer_algo() {
    const response = await axios.get(''https://api.exemplo.com/dados'', {
      headers: {
        ''Authorization'': `Bearer ${this.api_key}`,
        ''User-Agent'': ''OpenClaw/1.0''
      }
    });
    
    return response.data;
  }
}
```

### Integração com Memória do OpenClaw

```javascript
class SkillComMemoria {
  constructor(config = {}, memory = null) {
    this.memory = memory;
  }

  async buscar_com_cache(chave) {
    // Buscar cache
    const em_cache = await this.memory.get(`cache:${chave}`);
    
    if (em_cache) {
      return em_cache;
    }

    // Se não estiver em cache, buscar e guardar
    const dados = await this.fazer_busca(chave);
    
    await this.memory.set(
      `cache:${chave}`,
      dados,
      { ttl: 3600 } // 1 hora
    );

    return dados;
  }

  async fazer_busca(chave) {
    // Implementação
    return { dados: ''resultado'' };
  }
}
```

## Publicando Sua Skill para a Comunidade

### 1. Estrutura de Diretórios Completa

```
crypto-price-skill/
├── skill.json
├── skill.js
├── README.md
├── LICENSE
├── examples/
│   ├── exemplo-basico.js
│   └── com-memoria.js
├── tests/
│   └── skill.test.js
└── .gitignore
```

### 2. README.md Profissional

```markdown
# Crypto Price Skill para OpenClaw

Busca preços de criptomoedas em tempo real usando a API CoinGecko.

## Instalação

\\`\\`\\`bash
openclaw skill install crypto-price
\\`\\`\\`

## Uso

\\`\\`\\`javascript
// No seu OpenClaw
const preco = await skill.preco({ moeda: ''bitcoin'' });
\\`\\`\\`

## Configuração

Nenhuma configuração necessária! A API CoinGecko é gratuita.

## Licença

MIT
```

### 3. Publicar no Registry

```bash
# 1. Criar conta no npm
npm adduser

# 2. Registrar sua skill com prefixo openclaw-skill-
npm publish

# 3. Notificar comunidade
# - Abrir issue no repositório OpenClaw
# - Postar no Discord/Forum da comunidade
```

## Padrões Avançados

### Error Handling Robusto

```javascript
async execute(command, params) {
  try {
    // Validar parametros
    this.validar(params);
    
    // Executar comando
    const resultado = await this[command](params);
    
    // Validar resposta
    if (!resultado.sucesso) {
      throw new Error(resultado.erro);
    }
    
    return resultado;
  } catch (erro) {
    return {
      sucesso: false,
      erro: erro.message,
      stack: process.env.NODE_ENV === ''development'' ? erro.stack : undefined
    };
  }
}

validar(params) {
  if (!params || typeof params !== ''object'') {
    throw new Error(''Parametros inválidos'');
  }
}
```

### Rate Limiting

```javascript
const pQueue = require(''p-queue'');

class SkillComRateLimit {
  constructor() {
    this.queue = new pQueue({ 
      concurrency: 1,
      interval: 60000,
      intervalCap: 30 // 30 requisições por minuto
    });
  }

  async fazer_requisicao() {
    return this.queue.add(() => this.chamar_api());
  }

  async chamar_api() {
    // Implementação
  }
}
```

### Retry com Backoff Exponencial

```javascript
async retryComBackoff(fn, maxRetries = 3) {
  let tentativa = 0;
  
  while (tentativa < maxRetries) {
    try {
      return await fn();
    } catch (erro) {
      tentativa++;
      
      if (tentativa >= maxRetries) {
        throw erro;
      }
      
      const delay = Math.pow(2, tentativa) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

## Exemplos Práticos Completos

### Skill para Buscar Artigos do Dev.to

```javascript
const axios = require(''axios'');

class DevToSkill {
  async buscar_artigos(params) {
    const { tag = ''javascript'', limite = 5 } = params;
    
    const response = await axios.get(''https://dev.to/api/articles'', {
      params: {
        tag_name: tag,
        per_page: limite
      }
    });

    return {
      sucesso: true,
      artigos: response.data.map(artigo => ({
        titulo: artigo.title,
        autor: artigo.user.name,
        link: artigo.url,
        reacoes: artigo.positive_reactions_count,
        leitura_minutos: artigo.reading_time_minutes
      }))
    };
  }
}

module.exports = DevToSkill;
```

### Skill para Resumir Textos

```javascript
class ResumoSkill {
  async resumir(params) {
    const { texto, linhas = 3 } = params;
    
    // Usar transformers.js para IA offline
    const { pipeline } = await import(''@xenova/transformers'');
    const summarizer = await pipeline(''summarization'', ''Xenova/bart-large-cnn'');
    
    const resultado = await summarizer(texto, { max_length: 100 });
    
    return {
      sucesso: true,
      original_palavras: texto.split('' '').length,
      resumo: resultado[0].summary_text,
      taxa_compressao: ''70%''
    };
  }
}

module.exports = ResumoSkill;
```

## Testes para Sua Skill

```javascript
const CryptoPriceSkill = require(''../skill'');
const assert = require(''assert'');

describe(''CryptoPriceSkill'', () => {
  let skill;

  before(() => {
    skill = new CryptoPriceSkill();
  });

  it(''deve buscar preço do Bitcoin'', async () => {
    const resultado = await skill.preco({ moeda: ''bitcoin'' });
    assert.strictEqual(resultado.sucesso, true);
    assert.ok(resultado.dados.preco);
  });

  it(''deve retornar top 10'', async () => {
    const resultado = await skill.top10({});
    assert.strictEqual(resultado.sucesso, true);
    assert.strictEqual(resultado.top_10.length, 10);
  });

  it(''deve tratar moeda inválida'', async () => {
    const resultado = await skill.preco({ moeda: ''xyzinvalido'' });
    assert.strictEqual(resultado.sucesso, false);
  });
});
```

Execute com:
```bash
npm test
```

## Recursos Adicionais

- **Documentação OpenClaw**: [openclaw.ai/docs](https://openclaw.ai/docs)
- **Registry de Skills**: [openclaw.ai/skills](https://openclaw.ai/skills)
- **Community Discord**: [discord.gg/openclaw](https://discord.gg/openclaw)
- **Exemplos GitHub**: [github.com/openclaw/skill-examples](https://github.com/openclaw/skill-examples)

## Dicas Finais

✅ **Faça:**
- Documentar bem sua Skill
- Adicionar testes
- Usar tipos/JSDoc
- Tratar erros apropriadamente
- Respeitar rate limits de APIs

❌ **Evite:**
- Hardcodear API keys
- Fazer requisições síncronas
- Ignorar timeouts
- Publicar sem testes
- Quebrar compatibilidade entre versões

---

Parabéns! Você agora pode criar Skills poderosas para personalizar seu OpenClaw. Comece simples, teste bem e compartilhe com a comunidade! 🚀
',
  'tool',
  ARRAY['openclaw', 'skills', 'desenvolvimento', 'automação', 'ia-pessoal'],
  false,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'Como Instalar OpenClaw no Mac e Linux',
  'Tutorial detalhado de instalação do OpenClaw em Mac (Intel e M1/M2/M3) e Linux com verificação de funcionamento.',
  '
# Como Instalar OpenClaw no Mac e Linux

Guia passo a passo para instalar o OpenClaw em seu computador Mac ou Linux, com verificações e troubleshooting.

## Requisitos do Sistema

### Para Mac
- **Sistema operacional**: macOS 11+ (Big Sur ou superior)
- **Processador**: Intel ou Apple Silicon (M1/M2/M3/M4)
- **RAM**: Mínimo 4GB (recomendado 8GB+)
- **Disco**: 10GB livres
- **Node.js**: 18.0.0 ou superior

### Para Linux
- **Distribuições suportadas**: 
  - Ubuntu 20.04 LTS ou superior
  - Debian 11 ou superior
  - Fedora 35 ou superior
  - Arch Linux
- **RAM**: Mínimo 4GB (recomendado 8GB+)
- **Disco**: 10GB livres
- **Node.js**: 18.0.0 ou superior

## Passo 1: Instalar Node.js

### No Mac com Homebrew (Recomendado)

Se não tiver Homebrew instalado:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Instalar Node.js:
```bash
brew install node
```

### No Mac sem Homebrew

Baixe em: https://nodejs.org/

Escolha a versão **LTS (Long Term Support)** e siga o instalador.

### No Linux - Ubuntu/Debian

```bash
# Atualizar repositórios
sudo apt update
sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### No Linux - Fedora

```bash
sudo dnf module enable nodejs:20
sudo dnf install nodejs
```

### No Linux - Arch

```bash
sudo pacman -S nodejs npm
```

## Passo 2: Verificar Instalação do Node.js

Em ambos os sistemas, verifique:

```bash
# Verificar Node.js
node --version
# Deve mostrar: v20.x.x ou superior

# Verificar npm
npm --version
# Deve mostrar: 10.x.x ou superior
```

Se vir versões antigas, atualize:

```bash
# Mac com Homebrew
brew upgrade node

# Linux
sudo apt upgrade nodejs  # ou equivalente do seu sistema
```

## Passo 3: Instalar Git (se necessário)

### No Mac
```bash
brew install git
```

### No Linux
```bash
# Ubuntu/Debian
sudo apt install git

# Fedora
sudo dnf install git

# Arch
sudo pacman -S git
```

Verifique:
```bash
git --version
# Deve mostrar: git version 2.x.x ou superior
```

## Passo 4: Clonar Repositório OpenClaw

Escolha uma pasta onde deseja instalar (recomendação: home):

```bash
cd ~
git clone https://github.com/ruvnet/openclaw.git
cd openclaw
```

Verifique os arquivos:
```bash
ls -la
# Deve incluir: package.json, .env.example, etc.
```

## Passo 5: Instalar Dependências

```bash
npm install
```

Isso vai:
- Ler `package.json`
- Baixar todas as bibliotecas necessárias
- Compilar módulos nativos
- Criar pasta `node_modules/`

⏱️ **Tempo esperado**: 2-5 minutos

Se vir warnings sobre vulnerabilidades, isso é normal. Se houver erros críticos:

```bash
# Limpar e tentar novamente
rm -rf node_modules package-lock.json
npm install
```

## Passo 6: Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

Abra o arquivo `.env` com seu editor favorito:

```bash
# No Mac/Linux
nano .env

# Ou em VS Code
code .env

# Ou em outro editor
vim .env
```

### Configuração Mínima Necessária

```env
# API Keys (obrigatório escolher pelo menos um)
OPENAI_API_KEY=sk-proj-sua-chave-openai
# ou
ANTHROPIC_API_KEY=sk-ant-sua-chave-anthropic

# Informações básicas
OWNER_NAME=Seu Nome
OWNER_EMAIL=seu-email@example.com

# Opcional: Porta de execução
PORT=3000
```

### Obtendo API Keys

**OpenAI (ChatGPT):**
1. Acesse: https://platform.openai.com/api-keys
2. Faça login com sua conta OpenAI
3. Clique em "Create new secret key"
4. Copie a chave (você não verá novamente!)
5. Cole em `OPENAI_API_KEY=`

**Anthropic (Claude):**
1. Acesse: https://console.anthropic.com/
2. Faça login com sua conta Anthropic
3. Vá para API Keys
4. Clique em "Create Key"
5. Copie e cole em `ANTHROPIC_API_KEY=`

## Passo 7: Verificar Instalação

Antes de rodar, verifique a configuração:

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Listar scripts disponíveis
npm run
```

Você deve ver scripts como: `start`, `dev`, `build`, `test`.

## Passo 8: Iniciar o OpenClaw

### Modo Produção

```bash
npm start
```

### Modo Desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Saída Esperada

Você deve ver mensagens como:

```
✓ OpenClaw v1.0.0 iniciado
✓ Banco de dados conectado
✓ API inicializado na porta 3000
✓ Aguardando conexões...
```

Se vir erros, não feche o terminal ainda - anote a mensagem de erro.

## Passo 9: Teste de Funcionamento

Em **outro terminal**, teste se está rodando:

```bash
# Verificar se processo está rodando
ps aux | grep openclaw
# ou
lsof -i :3000  # Se estiver na porta 3000
```

Se não aparecer nada, o OpenClaw não iniciou corretamente.

## Troubleshooting Comum

### Erro: "command not found: npm"
```bash
# Verifique instalação
npm --version

# Se não funcionar, reinstale Node.js
# Mac: brew install node
# Linux: sudo apt install nodejs npm
```

### Erro: "Cannot find module"
```bash
# Limpe e reinstale
rm -rf node_modules
npm install
```

### Erro: "Port 3000 already in use"
```bash
# Use outra porta
PORT=3001 npm start

# Ou mate o processo anterior
lsof -i :3000
kill -9 <PID>
```

### Erro: "EACCES: permission denied"
```bash
# No Linux, pode precisar de permissões
chmod -R 755 openclaw/

# Ou use sudo (não recomendado)
sudo npm install
```

### Erro: "Invalid API Key"
1. Verifique se copiou a chave inteira sem espaços
2. Confirme que a chave é válida em https://platform.openai.com/account/api-keys
3. Verifique que tem créditos na conta
4. Tente gerar uma chave nova

### OpenClaw não conecta a mensagens
1. Verifique internet
2. Verifique logs: `tail -f openclaw.log`
3. Tente conectar via Telegram (mais estável)
4. Reinicie: `Ctrl+C` e `npm start`

## Próximas Configurações

Após instalação bem-sucedida:

### 1. Conectar a WhatsApp/Telegram
Veja: `/como-configurar-openclaw-whatsapp-telegram`

### 2. Integrar Gmail e Google Calendar
Veja: `/como-conectar-openclaw-gmail-calendar`

### 3. Aprender Comandos
Veja: `/primeiros-passos-openclaw-produtividade`

## Atualizando OpenClaw

Para atualizar para a versão mais recente:

```bash
cd ~/openclaw
git pull origin main
npm install
npm start
```

## Desinstalando OpenClaw

Se precisar remover:

```bash
# Parar o processo (no terminal onde roda)
Ctrl+C

# Remover pasta (CUIDADO: isso apaga tudo!)
rm -rf ~/openclaw
```

## Próximas Etapas

✅ OpenClaw instalado e testado
→ [Conectar com WhatsApp/Telegram](/como-configurar-openclaw-whatsapp-telegram)
→ [Configurar integrações](/como-conectar-openclaw-gmail-calendar)

---

**Dúvidas?** Consulte a [comunidade OpenClaw no Discord](https://discord.gg/openclaw)
',
  'tool',
  ARRAY['openclaw', 'instalação', 'mac', 'linux', 'tutorial'],
  false,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'Guia Completo para Iniciantes com OpenClaw',
  'Aprenda como começar com OpenClaw, seu assistente pessoal de IA open source. Guia passo a passo desde a instalação até os primeiros comandos.',
  '
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
',
  'tool',
  ARRAY['openclaw', 'tutorial', 'iniciante', 'ia', 'open-source'],
  true,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'OpenClaw Heartbeats: Automação Proativa e Agendamento',
  'Configure Heartbeats para automação proativa: agendamentos, check-ins automáticos, morning briefings e monitoramento contínuo com seu assistente de IA pessoal.',
  '
# OpenClaw Heartbeats: Tarefas Proativas e Automação

**Heartbeats** são tarefas agendadas que seu OpenClaw executa automaticamente, sem você precisar pedir. É como ter um assistente trabalhando 24/7 em background, checando coisas, lembrando você, e prevenindo problemas.

## O que são Heartbeats?

Heartbeats são diferenciados de Skills:

| Aspecto | Skill | Heartbeat |
|--------|-------|-----------|
| **Ativação** | Você solicita | Automático agendado |
| **Frequência** | Sob demanda | Cron/Interval |
| **Exemplos** | "Buscar preço BTC" | "Verificar saúde servidores" |
| **Latência ok?** | Sim | Sim |
| **Notificações** | Não | Sim |

## Arquitetura de Heartbeats

```
┌─────────────────────────────────────────┐
│     Scheduler (Cron/Interval)           │
└────────────────┬────────────────────────┘
                 │
                 ├─→ Validação (pré-condições)
                 │
                 ├─→ Execução (heartbeat.js)
                 │
                 ├─→ Armazenamento (memory)
                 │
                 └─→ Notificação (push/email/webhook)
```

## Configurar Heartbeats

### 1. Arquivo de Configuração

Crie `~/.openclaw/heartbeats.json`:

```json
{
  "version": "1.0",
  "heartbeats": [
    {
      "id": "morning-briefing",
      "name": "Morning Briefing",
      "description": "Relatório matinal com notícias importantes",
      "cron": "0 8 * * 1-5",
      "enabled": true,
      "handler": "heartbeats/morning-briefing.js",
      "config": {
        "incluir_noticias": true,
        "incluir_email": true,
        "incluir_tarefas": true,
        "tempo_maximo_ms": 30000
      },
      "notifications": {
        "enabled": true,
        "method": "push"
      }
    },
    {
      "id": "health-check",
      "name": "Health Check",
      "description": "Verifica saúde de servidores",
      "cron": "*/5 * * * *",
      "enabled": true,
      "handler": "heartbeats/health-check.js",
      "config": {
        "timeout": 10000,
        "alert_threshold": 2
      }
    }
  ],
  "scheduler": {
    "enabled": true,
    "timezone": "America/Sao_Paulo",
    "max_concurrent": 3,
    "retry_failed": true,
    "max_retries": 2
  }
}
```

### 2. Expressões Cron Explicadas

```
* * * * *
│ │ │ │ │
│ │ │ │ └─ Dia da semana (0-7, 0=domingo)
│ │ │ └─── Mês (1-12)
│ │ └───── Dia do mês (1-31)
│ └─────── Hora (0-23)
└───────── Minuto (0-59)
```

Exemplos:

```
0 8 * * 1-5        # 8:00 AM, seg-sex
0 0 * * *          # Meia-noite (diário)
*/15 * * * *       # A cada 15 minutos
0 0 * * 0          # Domingo à meia-noite (semanal)
0 0 1 * *          # 1º dia do mês à meia-noite
0 9-17 * * 1-5     # A cada hora (9-17) seg-sex
```

## Heartbeats Fundamentais

### 1. Morning Briefing

```javascript
// heartbeats/morning-briefing.js
const axios = require(''axios'');

class MorningBriefing {
  constructor(openclaw, config = {}) {
    this.openclaw = openclaw;
    this.config = config;
    this.name = ''morning-briefing'';
  }

  async execute() {
    console.log(''📰 Preparando Morning Briefing...'');

    try {
      const briefing = {
        timestamp: new Date().toISOString(),
        secoes: {}
      };

      // 1. Tarefas do dia
      if (this.config.incluir_tarefas) {
        briefing.secoes.tarefas = await this.buscarTarefasHoje();
      }

      // 2. Notícias importantes
      if (this.config.incluir_noticias) {
        briefing.secoes.noticias = await this.buscarNoticiasPersonalizadas();
      }

      // 3. Status de projetos
      briefing.secoes.projetos = await this.buscarStatusProjetos();

      // 4. Reminders
      briefing.secoes.lembretes = await this.buscarLembretes();

      // 5. Dados pessoais
      briefing.secoes.dados = await this.coletarDadosPessoais();

      // Armazenar em memória
      await this.openclaw.memory.store({
        namespace: ''briefings'',
        key: `morning-${new Date().toISOString().split(''T'')[0]}`,
        value: briefing
      });

      // Notificar
      await this.notificar(briefing);

      return {
        sucesso: true,
        briefing
      };

    } catch (erro) {
      console.error(''Erro no Morning Briefing:'', erro);
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  async buscarTarefasHoje() {
    // Integrar com seu TODO manager
    // (Todoist, Notion, etc)
    return [
      {
        titulo: ''Revisar PR #123'',
        prioridade: ''alta'',
        deadline: ''14:00''
      },
      {
        titulo: ''Call com cliente'',
        prioridade: ''alta'',
        deadline: ''15:00''
      }
    ];
  }

  async buscarNoticiasPersonalizadas() {
    // Buscar notícias de interesse
    const interesses = [''tecnologia'', ''IA'', ''startup''];

    const noticias = [];
    for (const tema of interesses) {
      const response = await axios.get(
        `https://newsapi.org/v2/everything`,
        {
          params: {
            q: tema,
            sortBy: ''publishedAt'',
            language: ''pt'',
            pageSize: 2,
            apiKey: process.env.NEWS_API_KEY
          }
        }
      );

      noticias.push({
        tema,
        items: response.data.articles.slice(0, 2)
      });
    }

    return noticias;
  }

  async buscarStatusProjetos() {
    const projetos = await this.openclaw.memory.search({
      namespace: ''projetos'',
      query: ''em-andamento'',
      limit: 5
    });

    return projetos.map(p => ({
      nome: p.value.nome,
      status: p.value.status,
      bloqueios: p.value.bloqueios || []
    }));
  }

  async buscarLembretes() {
    const lembretes = await this.openclaw.memory.search({
      namespace: ''lembretes'',
      query: new Date().toISOString().split(''T'')[0],
      limit: 10
    });

    return lembretes;
  }

  async coletarDadosPessoais() {
    return {
      temperatura: await this.buscarTemperatura(),
      clima: await this.buscarClima(),
      saude: await this.buscarDadosSaude()
    };
  }

  async buscarTemperatura() {
    // Integração com API de clima
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Sao%20Paulo&appid=${process.env.WEATHER_API_KEY}`
      );
      return response.data.main.temp;
    } catch {
      return null;
    }
  }

  async buscarClima() {
    // Similar ao acima
    return ''Ensolarado'';
  }

  async buscarDadosSaude() {
    // Integrar com wearable/health app
    return {
      passos: 0,
      sono_horas: 7,
      frequencia_cardiaca: 72
    };
  }

  async notificar(briefing) {
    // Enviar notificação push
    if (this.config.notifications?.enabled) {
      const mensagem = this.formatarMensagem(briefing);

      // Push notification
      await this.enviarPushNotification({
        titulo: ''📰 Morning Briefing'',
        corpo: mensagem,
        prioridade: ''high''
      });

      // Email
      if (this.config.incluir_email) {
        await this.enviarEmail({
          assunto: ''📰 Seu Morning Briefing'',
          html: this.formatarHtml(briefing)
        });
      }
    }
  }

  formatarMensagem(briefing) {
    const tarefas = briefing.secoes.tarefas?.length || 0;
    const noticias = briefing.secoes.noticias?.length || 0;

    return `${tarefas} tarefas | ${noticias} notícias | Status OK`;
  }

  formatarHtml(briefing) {
    return `
      <h1>Morning Briefing</h1>
      <h2>Tarefas de Hoje</h2>
      ${this.renderizarTarefas(briefing.secoes.tarefas)}
      <h2>Notícias</h2>
      ${this.renderizarNoticias(briefing.secoes.noticias)}
    `;
  }

  renderizarTarefas(tarefas) {
    return tarefas
      .map(t => `<li>${t.titulo} (${t.prioridade})</li>`)
      .join('''');
  }

  renderizarNoticias(noticias) {
    return noticias
      .map(n => `<p><strong>${n.tema}</strong>: ${n.items[0].title}</p>`)
      .join('''');
  }
}

module.exports = MorningBriefing;
```

### 2. Health Check (Monitoramento)

```javascript
// heartbeats/health-check.js
const axios = require(''axios'');

class HealthCheck {
  constructor(openclaw, config = {}) {
    this.openclaw = openclaw;
    this.config = config;
    this.alertas_consecutivos = {};
  }

  async execute() {
    console.log(''🏥 Executando Health Check...'');

    const servicos = [
      {
        nome: ''API Principal'',
        url: ''https://api.meuprojeto.com/health'',
        critico: true
      },
      {
        nome: ''Database'',
        url: ''https://api.meuprojeto.com/db/health'',
        critico: true
      },
      {
        nome: ''Cache Redis'',
        url: ''https://api.meuprojeto.com/redis/health'',
        critico: false
      }
    ];

    const resultados = [];

    for (const servico of servicos) {
      const status = await this.verificarServico(servico);
      resultados.push(status);

      // Verificar thresholds
      if (!status.online) {
        this.alertas_consecutivos[servico.nome] = 
          (this.alertas_consecutivos[servico.nome] || 0) + 1;

        if (this.alertas_consecutivos[servico.nome] >= this.config.alert_threshold) {
          await this.alertarProblema(servico, status);
        }
      } else {
        this.alertas_consecutivos[servico.nome] = 0;
      }
    }

    // Armazenar em memória
    await this.openclaw.memory.store({
      namespace: ''health-checks'',
      key: `check-${Date.now()}`,
      value: {
        timestamp: new Date(),
        resultados,
        resumo: this.gerarResumo(resultados)
      }
    });

    return { sucesso: true, resultados };
  }

  async verificarServico(servico) {
    try {
      const response = await axios.get(servico.url, {
        timeout: this.config.timeout
      });

      const dados = response.data;

      return {
        nome: servico.nome,
        online: true,
        status_code: response.status,
        tempo_resposta: response.headers[''x-response-time''],
        dados: dados
      };
    } catch (erro) {
      return {
        nome: servico.nome,
        online: false,
        erro: erro.message,
        critico: servico.critico
      };
    }
  }

  async alertarProblema(servico, status) {
    console.warn(`⚠️ ALERTA: ${servico.nome} offline!`);

    // Enviar notificação
    await this.openclaw.notificar({
      titulo: ''🚨 Health Check Alert'',
      mensagem: `${servico.nome} está offline (${status.erro})`,
      prioridade: servico.critico ? ''critical'' : ''warning''
    });

    // Armazenar alerta
    await this.openclaw.memory.store({
      namespace: ''alertas'',
      key: `alerta-${Date.now()}`,
      value: {
        servico: servico.nome,
        timestamp: new Date(),
        critico: servico.critico,
        erro: status.erro
      }
    });
  }

  gerarResumo(resultados) {
    const online = resultados.filter(r => r.online).length;
    const total = resultados.length;
    return `${online}/${total} serviços online`;
  }
}

module.exports = HealthCheck;
```

### 3. Limpeza e Manutenção

```javascript
// heartbeats/limpeza-automatica.js
const fs = require(''fs'').promises;
const path = require(''path'');

class LimpezaAutomatica {
  constructor(openclaw, config = {}) {
    this.openclaw = openclaw;
    this.config = {
      dias_retencao_logs: 30,
      limpar_cache: true,
      limpar_temporarios: true,
      ...config
    };
  }

  async execute() {
    console.log(''🧹 Iniciando limpeza automática...'');

    const tarefas = [
      () => this.limparMemoriaAnterior(),
      () => this.limparLogs(),
      () => this.limparTemporarios(),
      () => this.comprimir_dados()
    ];

    const resultados = [];

    for (const tarefa of tarefas) {
      try {
        const resultado = await tarefa();
        resultados.push({
          tarefa: tarefa.name,
          sucesso: true,
          resultado
        });
      } catch (erro) {
        resultados.push({
          tarefa: tarefa.name,
          sucesso: false,
          erro: erro.message
        });
      }
    }

    await this.openclaw.memory.store({
      namespace: ''limpezas'',
      key: `limpeza-${Date.now()}`,
      value: {
        timestamp: new Date(),
        resultados,
        economia_mb: this.calcularEconomia(resultados)
      }
    });

    return { sucesso: true, resultados };
  }

  async limparMemoriaAnterior() {
    // Remove memórias antigas além do TTL
    const items = await this.openclaw.memory.find({
      older_than: ''90 days''
    });

    let removidas = 0;
    for (const item of items) {
      await this.openclaw.memory.delete(item.id);
      removidas++;
    }

    return `${removidas} memórias antigas removidas`;
  }

  async limparLogs() {
    const logDir = path.join(process.env.HOME, ''.openclaw/logs'');
    const agora = Date.now();
    const diasMs = this.config.dias_retencao_logs * 24 * 60 * 60 * 1000;

    const arquivos = await fs.readdir(logDir);

    let removidos = 0;
    for (const arquivo of arquivos) {
      const caminhoCompleto = path.join(logDir, arquivo);
      const stats = await fs.stat(caminhoCompleto);

      if (agora - stats.mtimeMs > diasMs) {
        await fs.unlink(caminhoCompleto);
        removidos++;
      }
    }

    return `${removidos} logs removidos`;
  }

  async limparTemporarios() {
    if (!this.config.limpar_temporarios) return ''Ignorado'';

    const tmpDir = path.join(process.env.HOME, ''.openclaw/tmp'');

    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
      return ''Pasta temporária limpa'';
    } catch {
      return ''Sem arquivos temporários'';
    }
  }

  async comprimir_dados() {
    // Comprimir dados antigos
    return ''Dados comprimidos'';
  }

  calcularEconomia(resultados) {
    // Estimar economia de espaço
    return Math.random() * 500; // MB (simplificado)
  }
}

module.exports = LimpezaAutomatica;
```

### 4. Monitoramento Contínuo

```javascript
// heartbeats/monitor-contínuo.js
class MonitorContinuo {
  constructor(openclaw, config = {}) {
    this.openclaw = openclaw;
    this.config = config;
    this.thresholds = {
      cpu: 80,
      memoria: 85,
      disco: 90,
      ...config.thresholds
    };
  }

  async execute() {
    console.log(''📊 Monitorando sistema...'');

    const metricas = {
      cpu: await this.verificarCPU(),
      memoria: await this.verificarMemoria(),
      disco: await this.verificarDisco(),
      temperatura: await this.verificarTemperatura()
    };

    // Verificar thresholds
    for (const [metrica, valor] of Object.entries(metricas)) {
      if (valor && this.thresholds[metrica]) {
        if (valor > this.thresholds[metrica]) {
          await this.alertarMetrica(metrica, valor);
        }
      }
    }

    // Armazenar
    await this.openclaw.memory.store({
      namespace: ''metricas-sistema'',
      key: `metricas-${Date.now()}`,
      value: {
        timestamp: new Date(),
        metricas
      }
    });

    return { sucesso: true, metricas };
  }

  async verificarCPU() {
    // Usar os.cpus() para pegar CPU
    const os = require(''os'');
    const cpus = os.cpus();
    
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idlePercent = (100 * totalIdle / totalTick);
    return Math.round(100 - idlePercent);
  }

  async verificarMemoria() {
    const os = require(''os'');
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    return Math.round((usedMemory / totalMemory) * 100);
  }

  async verificarDisco() {
    // Usar ''df'' command ou similar
    return 45; // Exemplo
  }

  async verificarTemperatura() {
    // Usar sensores de temperatura se disponíveis
    return 55; // Celsius
  }

  async alertarMetrica(metrica, valor) {
    const limite = this.thresholds[metrica];

    await this.openclaw.notificar({
      titulo: `⚠️ ${metrica.toUpperCase()} Alto`,
      mensagem: `${metrica}: ${valor}% (limite: ${limite}%)`,
      prioridade: ''warning''
    });
  }
}

module.exports = MonitorContinuo;
```

## Registrar Heartbeats Customizados

```javascript
// Adicionar um heartbeat customizado
await openclaw.registerHeartbeat({
  id: ''meu-heartbeat'',
  nome: ''Meu Heartbeat'',
  cron: ''0 * * * *'', // A cada hora
  handler: async (openclaw, config) => {
    console.log(''Executando meu heartbeat...'');
    
    // Sua lógica aqui
    const resultado = await fazerAlgo();

    // Armazenar resultado
    await openclaw.memory.store({
      namespace: ''heartbeats'',
      key: `resultado-${Date.now()}`,
      value: resultado
    });

    return resultado;
  }
});
```

## Monitoramento de Heartbeats

```javascript
// Ver histórico de execuções
const historico = await openclaw.heartbeat.history({
  limite: 50
});

historico.forEach(h => {
  console.log(`${h.nome} - ${h.status} (${h.duracao_ms}ms)`);
});

// Ver falhas recentes
const falhas = await openclaw.heartbeat.getFailures({
  ultimas_horas: 24
});
```

## Alertas e Notificações

```javascript
// Configurar canais de notificação
await openclaw.config.set(''notificacoes'', {
  canais: {
    push: {
      enabled: true,
      servico: ''firebase''
    },
    email: {
      enabled: true,
      servico: ''sendgrid''
    },
    slack: {
      enabled: true,
      webhook: process.env.SLACK_WEBHOOK
    },
    telegram: {
      enabled: true,
      chat_id: process.env.TELEGRAM_CHAT_ID
    }
  },
  regras: {
    critico: [''push'', ''email'', ''slack''],
    warning: [''push'', ''email''],
    info: [''push'']
  }
});
```

## Exemplo: Combo Completo

```javascript
// heartbeats.json com múltiplos heartbeats
{
  "heartbeats": [
    {
      "id": "morning",
      "cron": "0 8 * * 1-5",
      "handler": "heartbeats/morning-briefing.js"
    },
    {
      "id": "health",
      "cron": "*/5 * * * *",
      "handler": "heartbeats/health-check.js"
    },
    {
      "id": "cleanup",
      "cron": "0 2 * * *",
      "handler": "heartbeats/limpeza-automatica.js"
    },
    {
      "id": "monitor",
      "cron": "*/10 * * * *",
      "handler": "heartbeats/monitor-continuo.js"
    }
  ]
}
```

## Boas Práticas

✅ **Recomendado:**
- Usar Cron expressions corretas
- Definir timeouts apropriados
- Armazenar resultados em memory
- Enviar notificações contextualizadas
- Monitorar execução de heartbeats

❌ **Evitar:**
- Heartbeats muito frequentes (causa overhead)
- Operações bloqueantes (use async)
- Sem tratamento de erro
- Sem logging
- Não notificar falhas

---

Com Heartbeats, seu OpenClaw trabalha 24/7 em seu favor! 🚀
',
  'tool',
  ARRAY['openclaw', 'heartbeats', 'automação', 'agendamento', 'cron', 'ia-proativa'],
  false,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'OpenClaw + Claude Code: Integração para Desenvolvimento',
  'Aprenda a integrar OpenClaw com Claude Code e Codex CLI para automação de desenvolvimento, PRs, code review e gestão de projetos via chat.',
  '
# OpenClaw + Claude Code: Integração para Desenvolvimento

Combine a inteligência do Claude Code com a persistência do OpenClaw para criar um pipeline de desenvolvimento completamente automatizado. Este tutorial mostra como integrar essas ferramentas poderosas.

## O Poder da Integração

Imagine dizer ao seu OpenClaw:

```
"Olá OpenClaw, execute os testes do projeto, 
se falharem, use Claude Code para corrigir, 
criar um commit e abrir um PR"
```

E tudo acontecer automaticamente. Isso é possível!

## Arquitetura da Integração

```
┌──────────────────────────────────────────────────┐
│         OpenClaw (Seu Assistente Local)          │
├──────────────────────────────────────────────────┤
│  • Memory (histórico de commits, issues)          │
│  • Skills (extensões customizadas)                │
│  • Heartbeats (tarefas agendadas)                 │
└──────────────┬──────────────────────────────────┘
               │
      ┌────────┴───────┬──────────────┐
      ▼                ▼              ▼
┌──────────────┐ ┌───────────┐ ┌──────────────┐
│ Claude Code  │ │ Codex CLI │ │ GitHub API   │
├──────────────┤ ├───────────┤ ├──────────────┤
│ • Code Gen   │ │ • Prompts │ │ • PRs        │
│ • Debugging  │ │ • Tasks   │ │ • Issues     │
│ • Refactor   │ │ • Agents  │ │ • Reviews    │
└──────────────┘ └───────────┘ └──────────────┘
```

## Setup Inicial

### 1. Instalar Dependências

```bash
# Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Codex CLI
npm install -g @opencode/codex

# OpenClaw
npm install -g @openclaw/cli

# GitHub CLI (para PR automation)
brew install gh
gh auth login
```

### 2. Configurar Autenticação

```bash
# Claude Code
claude-code auth login

# GitHub
gh auth login

# OpenClaw
openclaw config set --api-key YOUR_KEY
```

### 3. Criar Estrutura de Projeto

```bash
mkdir meu-projeto-automatizado
cd meu-projeto-automatizado
git init
npm init -y

# Criar arquivo de configuração para OpenClaw
touch .openclaw.json
```

Arquivo `.openclaw.json`:

```json
{
  "name": "meu-projeto",
  "description": "Projeto com automação OpenClaw + Claude Code",
  "integrations": {
    "claude-code": {
      "enabled": true,
      "auto-fix": true,
      "auto-refactor": false
    },
    "github": {
      "enabled": true,
      "auto-pr": true,
      "auto-review": true
    }
  },
  "memory": {
    "enabled": true,
    "namespace": "meu-projeto"
  }
}
```

## Conectando com Claude Code

Claude Code é o motor de geração de código do OpenClaw. Vamos criar uma Skill que usa Claude Code:

### Skill: claude-code-executor

```javascript
// skills/claude-code-executor.js
const { exec } = require(''child_process'');
const { promisify } = require(''util'');
const execPromise = promisify(exec);

class ClaudeCodeExecutor {
  constructor(config = {}) {
    this.name = ''claude-code-executor'';
    this.config = config;
  }

  /**
   * Gera código usando Claude Code
   */
  async gerar_funcao(params) {
    const { descricao, linguagem = ''javascript'', contexto = '''' } = params;

    try {
      const prompt = `
        Contexto: ${contexto}
        
        Gere uma função ${linguagem} que:
        ${descricao}
        
        Retorne APENAS o código, sem comentários.
      `;

      // Claude Code está disponível via CLI
      const { stdout } = await execPromise(
        `claude-code generate --prompt "${prompt}" --lang ${linguagem}`
      );

      return {
        sucesso: true,
        codigo: stdout.trim(),
        linguagem,
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  /**
   * Corrige código com erros
   */
  async corrigir_codigo(params) {
    const { codigo, erro, arquivo = ''desconhecido.js'' } = params;

    try {
      const prompt = `
        Arquivo: ${arquivo}
        
        Erro: ${erro}
        
        Código problemático:
        \\`\\`\\`
        ${codigo}
        \\`\\`\\`
        
        Corrija o código e retorne APENAS a versão corrigida.
      `;

      const { stdout } = await execPromise(
        `claude-code fix --prompt "${prompt}"`
      );

      return {
        sucesso: true,
        codigo_corrigido: stdout.trim(),
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  /**
   * Refatora código para melhorar qualidade
   */
  async refatorar(params) {
    const { codigo, arquivo, diretriz = ''melhorar legibilidade'' } = params;

    try {
      const prompt = `
        Arquivo: ${arquivo}
        
        Refatore este código para: ${diretriz}
        
        Código atual:
        \\`\\`\\`
        ${codigo}
        \\`\\`\\`
        
        Retorne APENAS o código refatorado.
      `;

      const { stdout } = await execPromise(
        `claude-code refactor --prompt "${prompt}"`
      );

      return {
        sucesso: true,
        codigo_refatorado: stdout.trim(),
        diretriz,
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  /**
   * Adiciona tipos TypeScript
   */
  async adicionar_tipos(params) {
    const { codigo, arquivo } = params;

    try {
      const prompt = `
        Arquivo: ${arquivo}
        
        Converta este código JavaScript para TypeScript com tipos apropriados:
        
        \\`\\`\\`javascript
        ${codigo}
        \\`\\`\\`
        
        Retorne APENAS o código TypeScript.
      `;

      const { stdout } = await execPromise(
        `claude-code convert --from js --to ts --prompt "${prompt}"`
      );

      return {
        sucesso: true,
        codigo_ts: stdout.trim(),
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }
}

module.exports = ClaudeCodeExecutor;
```

## Conectando com Codex CLI

Codex CLI oferece uma interface de linha de comando para tarefas automatizadas:

### Skill: codex-automacao

```javascript
// skills/codex-automacao.js
const { exec } = require(''child_process'');
const { promisify } = require(''util'');
const execPromise = promisify(exec);
const fs = require(''fs'').promises;
const path = require(''path'');

class CodexAutomacao {
  constructor(config = {}) {
    this.name = ''codex-automacao'';
    this.config = config;
    this.projectPath = config.projectPath || process.cwd();
  }

  /**
   * Executa uma tarefa via Codex
   */
  async executar_tarefa(params) {
    const { descricao, arquivos = [] } = params;

    try {
      let comando = `codex task create --description "${descricao}"`;
      
      if (arquivos.length > 0) {
        comando += ` --files ${arquivos.join('','')}`;
      }

      const { stdout } = await execPromise(comando, {
        cwd: this.projectPath
      });

      return {
        sucesso: true,
        output: stdout.trim(),
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  /**
   * Executa testes e retorna resultados
   */
  async rodar_testes(params) {
    const { tipo = ''unit'', cobertura = true } = params;

    try {
      let comando = `npm test -- --testPathPattern="${tipo}"`;
      
      if (cobertura) {
        comando += '' --coverage'';
      }

      const { stdout, stderr } = await execPromise(comando, {
        cwd: this.projectPath
      });

      // Parse do output de testes
      const passou = !stdout.includes(''FAIL'');
      
      return {
        sucesso: true,
        passou,
        output: stdout,
        erros: stderr || '''',
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        passou: false,
        erro: erro.message
      };
    }
  }

  /**
   * Cria agente para task específica
   */
  async criar_agente_task(params) {
    const { 
      tarefa, 
      tipo = ''coder'',
      prioridade = ''normal'' 
    } = params;

    try {
      const comando = `codex agent spawn --type ${tipo} --task "${tarefa}" --priority ${prioridade}`;

      const { stdout } = await execPromise(comando, {
        cwd: this.projectPath
      });

      return {
        sucesso: true,
        agente_info: stdout.trim(),
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  /**
   * Analisa código com Codex
   */
  async analisar_codigo(params) {
    const { arquivo, tipo = ''qualidade'' } = params;

    try {
      const conteudo = await fs.readFile(
        path.join(this.projectPath, arquivo),
        ''utf-8''
      );

      const comando = `codex analyze --type ${tipo}`;
      
      const { stdout } = await execPromise(
        `echo "${conteudo}" | ${comando}`,
        {
          cwd: this.projectPath,
          maxBuffer: 1024 * 1024 * 10 // 10MB
        }
      );

      return {
        sucesso: true,
        analise: stdout.trim(),
        arquivo,
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }
}

module.exports = CodexAutomacao;
```

## Automatizando PRs e Code Review

### Skill: github-pr-automation

```javascript
// skills/github-pr-automation.js
const { exec } = require(''child_process'');
const { promisify } = require(''util'');
const execPromise = promisify(exec);

class GitHubPRAutomation {
  constructor(config = {}) {
    this.name = ''github-pr-automation'';
    this.config = config;
    this.repo = config.repo || '''';
  }

  /**
   * Cria PR automaticamente
   */
  async criar_pr(params) {
    const {
      titulo,
      descricao,
      branch,
      base = ''main'',
      labels = [],
      reviewers = []
    } = params;

    try {
      // Criar branch se não existir
      await execPromise(`git checkout -b ${branch}`);

      // Fazer commit de mudanças
      await execPromise(''git add .'');
      await execPromise(`git commit -m "${titulo}"`);
      
      // Push
      await execPromise(`git push origin ${branch}`);

      // Criar PR com gh CLI
      let comando = `gh pr create --title "${titulo}" --body "${descricao}" --base ${base} --head ${branch}`;
      
      if (labels.length > 0) {
        comando += ` --label "${labels.join('','')}"`;
      }

      if (reviewers.length > 0) {
        comando += ` --reviewer "${reviewers.join('','')}"`;
      }

      const { stdout } = await execPromise(comando);

      // Extrair URL do PR
      const pr_url = stdout.trim();

      return {
        sucesso: true,
        pr_url,
        branch,
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  /**
   * Faz code review automaticamente
   */
  async code_review(params) {
    const { pr_number, evento = ''APPROVE'' } = params;

    try {
      const { stdout } = await execPromise(
        `gh pr review ${pr_number} --${evento.toLowerCase()}`
      );

      return {
        sucesso: true,
        review: stdout.trim(),
        pr_number,
        evento,
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  /**
   * Adiciona comentário inteligente ao PR
   */
  async comentar_pr(params) {
    const { pr_number, comentario } = params;

    try {
      await execPromise(
        `gh pr comment ${pr_number} --body "${comentario}"`
      );

      return {
        sucesso: true,
        pr_number,
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }

  /**
   * Merge automático quando PR aprovado
   */
  async merge_pr_automatico(params) {
    const { pr_number, estrategia = ''squash'' } = params;

    try {
      await execPromise(
        `gh pr merge ${pr_number} --${estrategia} --auto`
      );

      return {
        sucesso: true,
        pr_number,
        estrategia,
        timestamp: new Date().toISOString()
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }
}

module.exports = GitHubPRAutomation;
```

## Exemplo Completo: "Fix Tests" via OpenClaw

Vamos criar um workflow completo que você pode ativar pelo OpenClaw:

### Arquivo: workflows/fix-tests.js

```javascript
const ClaudeCodeExecutor = require(''../skills/claude-code-executor'');
const CodexAutomacao = require(''../skills/codex-automacao'');
const GitHubPRAutomation = require(''../skills/github-pr-automation'');

/**
 * Workflow automático: Detecta testes falhando e corrige
 * Uso: "OpenClaw, execute fix-tests"
 */
class FixTestsWorkflow {
  constructor(config = {}) {
    this.claudeCode = new ClaudeCodeExecutor(config);
    this.codex = new CodexAutomacao(config);
    this.github = new GitHubPRAutomation(config);
    this.memory = config.memory; // OpenClaw memory
  }

  /**
   * Executa o workflow completo
   */
  async executar(params = {}) {
    try {
      console.log(''🔍 Passo 1: Detectar testes falhando...'');
      const testesResult = await this.codex.rodar_testes({
        tipo: ''unit'',
        cobertura: false
      });

      if (testesResult.passou) {
        return {
          sucesso: true,
          mensagem: ''✅ Todos os testes passando!'',
          nenhuma_acao_necessaria: true
        };
      }

      console.log(''❌ Testes falhando. Analisando erros...'');
      
      // Armazenar na memória para referência futura
      await this.memory.set(''ultimo-teste-falha'', {
        output: testesResult.output,
        timestamp: new Date().toISOString()
      });

      console.log(''🤖 Passo 2: Usar Claude Code para corrigir...'');
      
      // Identificar arquivo problemático (exemplo simplificado)
      const arquivoProblematico = this.extrairArquivoDoErro(testesResult.output);

      // Corrigir código
      const correcao = await this.claudeCode.corrigir_codigo({
        codigo: testesResult.output,
        erro: testesResult.erros,
        arquivo: arquivoProblematico
      });

      if (!correcao.sucesso) {
        throw new Error(`Falha ao corrigir: ${correcao.erro}`);
      }

      console.log(''📝 Passo 3: Criar branch e commit...'');
      
      const branch = `fix/tests-${Date.now()}`;
      
      // Aqui você aplicaria a correção ao arquivo
      // (implementação simplificada)
      
      console.log(''🔁 Passo 4: Verificar se corrigiu...'');
      
      const testesNovoResult = await this.codex.rodar_testes({});
      
      if (!testesNovoResult.passou) {
        return {
          sucesso: false,
          mensagem: ''❌ Correção não funcionou'',
          detalhes: testesNovoResult
        };
      }

      console.log(''🎉 Passo 5: Criar PR com a correção...'');
      
      const pr = await this.github.criar_pr({
        titulo: ''Fix: Corrigir testes falhando'',
        descricao: `
## Correção Automática de Testes

Gerado automaticamente por OpenClaw + Claude Code

### Mudanças
- Corrigido arquivo: ${arquivoProblematico}
- Todos os testes passando agora ✅

### Próximos passos
1. Review este PR
2. Merge quando aprovado
`,
        branch,
        labels: [''automated'', ''tests'', ''fix''],
        reviewers: params.reviewers || []
      });

      if (pr.sucesso) {
        console.log(''✨ PR criado com sucesso!'');
        
        await this.memory.set(''ultimo-pr-correcao'', {
          pr_url: pr.pr_url,
          branch: branch,
          timestamp: new Date().toISOString()
        });
      }

      return {
        sucesso: true,
        mensagem: ''✅ Workflow completado com sucesso!'',
        etapas: {
          testes_detectados: true,
          codigo_corrigido: true,
          testes_validados: true,
          pr_criado: pr.sucesso,
          pr_url: pr.pr_url
        }
      };

    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message,
        detalhes: erro.stack
      };
    }
  }

  /**
   * Helper: Extrai arquivo problemático do output de teste
   */
  extrairArquivoDoErro(output) {
    const match = output.match(/●\\s+(.+?)\\s+/);
    return match ? match[1] : ''test.js'';
  }
}

module.exports = FixTestsWorkflow;
```

## Configurar como Heartbeat (Tarefa Automática)

Crie um arquivo `.openclaw/heartbeats.json` para executar automaticamente:

```json
{
  "heartbeats": [
    {
      "id": "daily-test-check",
      "name": "Verificar Testes Diáriamente",
      "cron": "0 9 * * 1-5",
      "descricao": "Roda testes todas as manhãs (9:00 AM, seg-sex)",
      "workflow": "fix-tests",
      "config": {
        "auto_fix": true,
        "create_pr": true
      }
    },
    {
      "id": "weekly-refactor",
      "name": "Refatoração Semanal",
      "cron": "0 18 * * 5",
      "descricao": "Refatora código todas as sextas (6:00 PM)",
      "workflow": "refactor-quality",
      "config": {
        "target": "src",
        "diretriz": "melhorar performance"
      }
    }
  ]
}
```

## Usando via Telegram ou Chat

Você pode integrar com Telegram para executar workflows:

```javascript
// integrations/telegram.js
const TelegramBot = require(''node-telegram-bot-api'');
const FixTestsWorkflow = require(''../workflows/fix-tests'');

class OpenClawTelegramBot {
  constructor(token, config) {
    this.bot = new TelegramBot(token, { polling: true });
    this.workflow = new FixTestsWorkflow(config);
    this.setupHandlers();
  }

  setupHandlers() {
    this.bot.on(''message'', async (msg) => {
      const texto = msg.text.toLowerCase();

      if (texto.includes(''fix tests'')) {
        const resultado = await this.workflow.executar();
        
        const resposta = resultado.sucesso 
          ? `✅ ${resultado.mensagem}\\n\\nPR: ${resultado.etapas.pr_url}`
          : `❌ Erro: ${resultado.erro}`;
        
        this.bot.sendMessage(msg.chat.id, resposta);
      }
    });
  }
}

module.exports = OpenClawTelegramBot;
```

## Monitorando com OpenClaw Memory

Armazene histórico de execuções:

```javascript
async executar_e_registrar(nome_workflow, params) {
  const inicio = Date.now();
  
  const resultado = await this.workflow.executar(params);
  
  const duracao = Date.now() - inicio;

  // Guardar na memória
  await this.memory.set(`workflow:${nome_workflow}:${Date.now()}`, {
    nome: nome_workflow,
    resultado: resultado.sucesso,
    duracao_ms: duracao,
    timestamp: new Date().toISOString(),
    detalhes: resultado
  });

  return resultado;
}
```

## Dicas e Boas Práticas

### ✅ Recomendado

- Usar variáveis de ambiente para chaves de API
- Implementar rate limiting em APIs
- Armazenar histórico de execuções em memory
- Testar workflows em branch separado primeiro
- Ter aprovação manual antes de merge em main

### ❌ Evitar

- Hardcodear dados sensíveis
- Executar workflows em main branch diretamente
- Não registrar execuções
- Ignorar falhas silenciosamente
- Fazer merge automático sem review

## Recursos

- **Claude Code Docs**: https://claude-code.com/docs
- **Codex CLI**: https://codex.opencode.dev
- **GitHub CLI**: https://cli.github.com
- **OpenClaw Docs**: https://openclaw.ai

---

Você agora tem um sistema completo de automação de desenvolvimento! 🚀 Customize conforme suas necessidades e ganhe horas de produtividade.
',
  'tool',
  ARRAY['openclaw', 'claude-code', 'codex', 'desenvolvimento', 'automação', 'ci-cd'],
  false,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'OpenClaw Memory: Construindo Seu Segundo Cérebro',
  'Aprenda a usar o sistema de memória persistente do OpenClaw para construir um segundo cérebro pessoal integrado com Obsidian, Notion e outras ferramentas.',
  '
# OpenClaw Memory: Construindo Seu Segundo Cérebro

O OpenClaw não apenas responde perguntas — ele **lembra**. Cada conversa, cada decisão, cada aprendizado fica armazenado e disponível para futuras interações. Este tutorial mostra como construir um segundo cérebro pessoal extremamente poderoso.

## Entendendo o Sistema de Memória

O OpenClaw tem **3 camadas de memória**:

### 1. **Memória de Sessão** (Curta prazo - Horas)
```
Conversas da sessão atual
Contexto imediato
Intenções do usuário
```

### 2. **Memória Persistente** (Médio prazo - Meses)
```
Fatos importantes
Decisions e escolhas
Padrões de comportamento
Histórico de projetos
```

### 3. **Memória Semântica** (Longo prazo - Permanente)
```
Conhecimento geral
Patterns descobertos
Aprendizados consolidados
Conectções entre conceitos
```

## Arquitetura de Memória

```
┌─────────────────────────────────────────────┐
│         OpenClaw Memory Database            │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐  ┌──────────────┐         │
│  │  Memória    │  │  Semântica   │         │
│  │ Persistente │  │   (Vector)   │         │
│  └────┬────────┘  └──────┬───────┘         │
│       │                  │                 │
│  ┌────▼──────────────────▼────────┐        │
│  │   Indexação + Busca Vetorial    │        │
│  │   (HNSW - Nearest Neighbor)     │        │
│  └────────────┬────────────────────┘        │
│               │                            │
│  ┌────────────▼─────────────┐              │
│  │  Compressão + Retenção   │              │
│  │  (Decay automático 90d)  │              │
│  └──────────────────────────┘              │
│                                             │
└─────────────────────────────────────────────┘
         ▲              ▲              ▲
         │              │              │
    ┌────┴┐      ┌──────┴──┐    ┌─────┴──┐
    │ API │      │ Sync    │    │ Webhooks│
    └─────┘      │ Git     │    └────────┘
                 │Notion   │
                 │Obsidian │
                 └─────────┘
```

## Configurando Memória Persistente

### 1. Inicializar Memória

Crie `~/.openclaw/memory.json`:

```json
{
  "version": "1.0",
  "config": {
    "persistent": {
      "enabled": true,
      "directory": "~/.openclaw/memory",
      "encryption": true,
      "auto_backup": true
    },
    "semantic": {
      "enabled": true,
      "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
      "vector_size": 384,
      "hnsw": {
        "enabled": true,
        "ef": 200,
        "m": 5
      }
    },
    "retention": {
      "default_ttl": 7776000,
      "auto_prune": true,
      "prune_interval": 86400
    }
  },
  "namespaces": [
    {
      "name": "decisions",
      "description": "Decisões importantes tomadas"
    },
    {
      "name": "learnings",
      "description": "Aprendizados e insights"
    },
    {
      "name": "projects",
      "description": "Histórico de projetos"
    },
    {
      "name": "contacts",
      "description": "Pessoas importantes"
    }
  ]
}
```

### 2. Tipos de Memória

```javascript
// Armazenar um fato
await openclaw.memory.store({
  namespace: ''facts'',
  key: ''favorite-lang'',
  value: ''Python'',
  metadata: {
    tags: [''tecnologia'', ''preferência''],
    importance: 8,
    source: ''conversation''
  },
  ttl: 31536000 // 1 ano
});

// Armazenar uma decisão
await openclaw.memory.store({
  namespace: ''decisions'',
  key: ''projeto-stack-2026'',
  value: {
    frontend: ''React 19'',
    backend: ''Node.js + Express'',
    database: ''PostgreSQL'',
    hosting: ''Vercel'',
    reasoning: ''Performance e escalabilidade''
  },
  metadata: {
    date: ''2026-02-24'',
    importance: 9,
    review_date: ''2026-06-24''
  }
});

// Armazenar um padrão
await openclaw.memory.store({
  namespace: ''patterns'',
  key: ''produtividade-peak'',
  value: {
    horario: ''09:00 - 12:00'',
    condicoes: ''Sem interrupções, café, música instrumental'',
    produtividade: ''3x''
  }
});

// Armazenar um contato
await openclaw.memory.store({
  namespace: ''contacts'',
  key: ''joão-arquiteto'',
  value: {
    nome: ''João Silva'',
    email: ''joao@company.com'',
    expertise: [''arquitetura'', ''backend'', ''devops''],
    projetos_juntos: [''ProjectX'', ''ProjectY''],
    personalidade: ''Direto, pragmático, muito bom em debugging''
  },
  metadata: {
    tags: [''desenvolvedor'', ''confiável''],
    ultimo_contato: ''2026-02-20''
  }
});
```

## Buscando Informações Antigas

### Busca Simples

```javascript
// Busca exata
const decision = await openclaw.memory.get({
  namespace: ''decisions'',
  key: ''projeto-stack-2026''
});

console.log(decision);
// Output: { frontend: ''React 19'', ... }
```

### Busca Semântica (Poderosa!)

```javascript
// Busca por similaridade
const learnings = await openclaw.memory.search({
  namespace: ''learnings'',
  query: ''Como melhorar performance em React'',
  limit: 5,
  threshold: 0.7
});

// Retorna os 5 learnings mais similares
learnings.forEach(item => {
  console.log(`${item.relevance}% - ${item.value.titulo}`);
});
```

### Busca Avançada com Filtros

```javascript
// Buscar com múltiplos critérios
const importants = await openclaw.memory.search({
  namespace: ''decisions'',
  query: ''tech decisions'',
  filters: {
    importance: { min: 8 },
    date: { after: ''2025-01-01'' },
    tags: { includes: [''tecnologia''] }
  },
  limit: 10
});
```

### Histórico Temporal

```javascript
// Ver evolução de uma ideia ao longo do tempo
const evolucao = await openclaw.memory.timeline({
  key_pattern: ''react-*'',
  from: ''2024-01-01'',
  to: ''2026-02-24''
});

evolucao.forEach(entry => {
  console.log(`${entry.date}: ${entry.evolution}`);
});
```

## Integração com Obsidian

Obsidian é um "vault" local perfeito para sincronizar com OpenClaw:

### Setup da Integração

Crie `~/.openclaw/integrations/obsidian.js`:

```javascript
const fs = require(''fs'').promises;
const path = require(''path'');

class ObsidianSync {
  constructor(config) {
    this.vaultPath = config.vaultPath;
    this.openclaw = config.openclaw;
    this.namespace = config.namespace || ''obsidian'';
  }

  /**
   * Sincronizar todas as notas para memória OpenClaw
   */
  async syncNotesMemory() {
    const notas = await this.lerTodasNotas();

    for (const nota of notas) {
      // Extrair metadata (YAML front matter)
      const metadata = this.extrairMetadata(nota.conteudo);

      await this.openclaw.memory.store({
        namespace: this.namespace,
        key: nota.titulo,
        value: {
          titulo: nota.titulo,
          conteudo: nota.conteudo,
          arquivo: nota.arquivo,
          tags: metadata.tags || [],
          criada: metadata.created || new Date(),
          modificada: new Date()
        },
        metadata: {
          tags: metadata.tags,
          importance: metadata.importance || 5,
          source: ''obsidian''
        }
      });
    }

    return `Sincronizadas ${notas.length} notas`;
  }

  /**
   * Buscar notas no Obsidian via OpenClaw
   */
  async buscarNotas(query) {
    const resultados = await this.openclaw.memory.search({
      namespace: this.namespace,
      query,
      limit: 10
    });

    return resultados.map(r => ({
      titulo: r.key,
      relevancia: r.relevance,
      arquivo: r.value.arquivo
    }));
  }

  /**
   * Criar nota no Obsidian a partir de memória
   */
  async criarNotaDeMemoria(chaveMemoria) {
    const memoria = await this.openclaw.memory.get({
      namespace: this.namespace,
      key: chaveMemoria
    });

    if (!memoria) {
      throw new Error(`Memória "${chaveMemoria}" não encontrada`);
    }

    const conteudo = this.gerarNota(memoria);

    const arquivo = path.join(
      this.vaultPath,
      `${chaveMemoria}.md`
    );

    await fs.writeFile(arquivo, conteudo);

    return `Nota criada em ${arquivo}`;
  }

  /**
   * Sincronizar mudanças do Obsidian para OpenClaw
   */
  async sincronizarAlteracoes() {
    const notas = await this.lerTodasNotas();

    for (const nota of notas) {
      const existente = await this.openclaw.memory.get({
        namespace: this.namespace,
        key: nota.titulo
      });

      if (!existente || existente.conteudo !== nota.conteudo) {
        // Atualizar se mudou
        await this.openclaw.memory.store({
          namespace: this.namespace,
          key: nota.titulo,
          value: nota
        });
      }
    }
  }

  // Helpers
  async lerTodasNotas() {
    const notas = [];
    const lerDiretorio = async (dir) => {
      const entradas = await fs.readdir(dir);

      for (const entrada of entradas) {
        const caminhoCompleto = path.join(dir, entrada);
        const stats = await fs.stat(caminhoCompleto);

        if (stats.isDirectory()) {
          await lerDiretorio(caminhoCompleto);
        } else if (entrada.endsWith(''.md'')) {
          const conteudo = await fs.readFile(caminhoCompleto, ''utf-8'');
          const titulo = entrada.replace(''.md'', '''');

          notas.push({
            titulo,
            conteudo,
            arquivo: caminhoCompleto
          });
        }
      }
    };

    await lerDiretorio(this.vaultPath);
    return notas;
  }

  extrairMetadata(conteudo) {
    const match = conteudo.match(/^---\\n([\\s\\S]*?)\\n---/);
    if (!match) return {};

    const yaml = match[1];
    const metadata = {};

    yaml.split(''\\n'').forEach(linha => {
      const [chave, ...valor] = linha.split('':'');
      if (chave && valor.length) {
        metadata[chave.trim()] = valor.join('':'').trim();
      }
    });

    return metadata;
  }

  gerarNota(memoria) {
    return `---
titulo: ${memoria.titulo}
criada: ${memoria.criada}
modificada: ${memoria.modificada}
tags: ${memoria.tags.join('', '')}
---

# ${memoria.titulo}

${memoria.conteudo}

---

**Última modificação**: ${memoria.modificada}
**Fonte**: OpenClaw Memory
`;
  }
}

module.exports = ObsidianSync;
```

### Usar no OpenClaw

```javascript
const ObsidianSync = require(''./integrations/obsidian'');

const sync = new ObsidianSync({
  vaultPath: ''/path/to/obsidian/vault'',
  openclaw: openclaw,
  namespace: ''obsidian''
});

// Sincronizar notas para memória
await sync.syncNotesMemory();

// Buscar notas
const resultados = await sync.buscarNotas(''produtividade'');

// Criar nota de memória
await sync.criarNotaDeMemoria(''padroes-trabalho'');
```

## Integração com Notion

Notion é ótimo para organização colaborativa. Sincronize com OpenClaw:

### Setup da Integração

```javascript
const { Client } = require(''@notionhq/client'');

class NotionSync {
  constructor(config) {
    this.notion = new Client({ 
      auth: process.env.NOTION_TOKEN 
    });
    this.databaseId = config.databaseId;
    this.openclaw = config.openclaw;
    this.namespace = ''notion'';
  }

  /**
   * Buscar dados do Notion e armazenar em memória
   */
  async sincronizarDoBanco(nomeBloco) {
    const response = await this.notion.databases.query({
      database_id: this.databaseId,
      filter: {
        property: ''Name'',
        title: {
          equals: nomeBloco
        }
      }
    });

    for (const page of response.results) {
      const titulo = page.properties.Name.title[0].plain_text;
      const conteudo = await this.extrairConteudo(page);

      await this.openclaw.memory.store({
        namespace: this.namespace,
        key: titulo,
        value: {
          titulo,
          conteudo,
          notion_id: page.id,
          notion_url: page.url,
          tags: page.properties.Tags?.multi_select.map(t => t.name) || []
        }
      });
    }
  }

  /**
   * Criar novo item no Notion a partir de memória
   */
  async criarItemNotion(chaveMemoria) {
    const memoria = await this.openclaw.memory.get({
      namespace: this.namespace,
      key: chaveMemoria
    });

    await this.notion.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        Name: {
          title: [{
            text: { content: memoria.titulo }
          }]
        },
        Content: {
          rich_text: [{
            text: { content: memoria.conteudo }
          }]
        },
        Tags: {
          multi_select: memoria.tags.map(tag => ({
            name: tag
          }))
        }
      }
    });
  }

  async extrairConteudo(page) {
    const blocks = await this.notion.blocks.children.list({
      block_id: page.id
    });

    let conteudo = '''';
    for (const block of blocks.results) {
      conteudo += this.extrairTextoDoBloco(block) + ''\\n'';
    }

    return conteudo;
  }

  extrairTextoDoBloco(block) {
    if (block.type === ''paragraph'') {
      return block.paragraph.rich_text
        .map(t => t.plain_text)
        .join('''');
    }
    if (block.type === ''heading_1'') {
      return ''# '' + block.heading_1.rich_text.map(t => t.plain_text).join('''');
    }
    if (block.type === ''heading_2'') {
      return ''## '' + block.heading_2.rich_text.map(t => t.plain_text).join('''');
    }
    return '''';
  }
}

module.exports = NotionSync;
```

## Building Your Second Brain

Um segundo cérebro eficaz tem essas características:

### 1. **Captura Sistemática**

```javascript
// Skill: brain-capture
class BrainCapture {
  async capturar(tipo, conteudo) {
    const hoje = new Date().toISOString().split(''T'')[0];

    await openclaw.memory.store({
      namespace: tipo,
      key: `${tipo}-${hoje}-${Date.now()}`,
      value: {
        conteudo,
        capturado_em: new Date(),
        tipo
      }
    });

    return `✅ Capturado em "${tipo}"`;
  }

  // Tipos de captura
  async capturar_ideia(descricao) {
    return this.capturar(''ideias'', { descricao });
  }

  async capturar_problema(problema) {
    return this.capturar(''problemas'', { problema });
  }

  async capturar_solucao(problema, solucao) {
    return this.capturar(''solucoes'', { problema, solucao });
  }

  async capturar_aprendizado(topico, aprendizado) {
    return this.capturar(''aprendizados'', { topico, aprendizado });
  }
}
```

### 2. **Processamento Automático**

```javascript
// Heartbeat: process-captures (1x por semana)
async function processarCapturasSemanais() {
  const ideias = await openclaw.memory.search({
    namespace: ''ideias'',
    query: '''',
    limit: 100
  });

  // Agrupar por tema
  const agrupadas = {};
  for (const ideia of ideias) {
    const tema = await classificarTema(ideia.value.descricao);
    if (!agrupadas[tema]) agrupadas[tema] = [];
    agrupadas[tema].push(ideia);
  }

  // Criar sumário
  for (const [tema, items] of Object.entries(agrupadas)) {
    await openclaw.memory.store({
      namespace: ''sumarios'',
      key: `sumario-${tema}-${Date.now()}`,
      value: {
        tema,
        quantidade: items.length,
        exemplos: items.slice(0, 3).map(i => i.value)
      }
    });
  }
}
```

### 3. **Busca Inteligente**

```javascript
// Buscar padrões nas decisões
async function encontrarPadroes() {
  const decisoes = await openclaw.memory.search({
    namespace: ''decisions'',
    query: '''',
    limit: 50
  });

  const padroes = {};

  for (const decisao of decisoes) {
    const reasoning = decisao.value.reasoning;
    
    // Contar palavras-chave
    const keywords = [''performance'', ''escalabilidade'', ''custo'', ''confiabilidade''];
    
    for (const kw of keywords) {
      if (reasoning.toLowerCase().includes(kw)) {
        padroes[kw] = (padroes[kw] || 0) + 1;
      }
    }
  }

  console.log(''Seus principais critérios de decisão:'', padroes);
}
```

## Casos de Uso Reais

### 1. **Resumo Semanal Automático**

```javascript
const resume = await openclaw.memory.generateSummary({
  namespace: ''aprendizados'',
  period: ''week'',
  format: ''markdown''
});

// Envia via email
await enviarEmail(''seu@email.com'', ''Resumo da Semana'', resume);
```

### 2. **Recomendações Personalizadas**

```javascript
const recomendacoes = await openclaw.memory.recommend({
  baseado_em: ''preferencias'',
  categoria: ''ferramentas-para-testar'',
  limite: 5
});

// "Baseado no que você gosta, testaria estes tools..."
```

### 3. **Continuidade Entre Sessões**

```javascript
// Ao iniciar novo dia
const contexto = await openclaw.memory.getContext({
  namespace: ''projetos'',
  query: ''projetos-em-andamento''
});

console.log(`Bem-vindo! Você está trabalhando em: ${contexto.projetos}`);
```

## Decay e Limpeza Automática

OpenClaw remove memórias antigas automaticamente:

```json
{
  "retention": {
    "policies": [
      {
        "namespace": "ideas",
        "ttl": 7776000,
        "prune_after": 5184000,
        "importance_threshold": 3
      },
      {
        "namespace": "decisions",
        "ttl": 31536000,
        "prune_after": 0,
        "importance_threshold": 7
      }
    ]
  }
}
```

## Segurança e Privacidade

```javascript
// OpenClaw criptografa automaticamente
const config = {
  memory: {
    encryption: {
      enabled: true,
      algorithm: ''aes-256-gcm'',
      keyDerivation: ''argon2''
    },
    backup: {
      enabled: true,
      frequency: ''daily'',
      encrypted: true,
      location: ''~/.openclaw/backups''
    }
  }
};
```

## Exemplo Final: Sistema Completo

```javascript
class SegundoCerebro {
  constructor(openclaw) {
    this.memory = openclaw.memory;
  }

  /**
   * Captura diária
   */
  async capturaDiaria() {
    return {
      energia: await this.perguntarSobre(''Como você se sente hoje?''),
      foco: await this.perguntarSobre(''Em que está focando?''),
      bloqueios: await this.perguntarSobre(''Algum bloqueio?''),
      ganhos: await this.perguntarSobre(''Ganhos do dia?'')
    };
  }

  /**
   * Revisão semanal
   */
  async revisaoSemanal() {
    const semana = await this.memory.search({
      namespace: ''capturas-diarias'',
      from: this.inicioSemana(),
      to: new Date()
    });

    const resumo = this.analisarSemana(semana);

    await this.memory.store({
      namespace: ''revisoes'',
      key: `review-${this.semanaAtual()}`,
      value: resumo
    });

    return resumo;
  }

  /**
   * Busca inteligente
   */
  async buscarConhecimento(pergunta) {
    const relevante = await this.memory.search({
      namespace: ''*'',
      query: pergunta,
      limit: 20
    });

    return relevante;
  }
}
```

## Próximas Etapas

1. Configure memória persistente
2. Sincronize com Obsidian/Notion
3. Configure heartbeats para processamento automático
4. Comece a capturar ideias regularmente
5. Revise e refine seu segundo cérebro

---

Seu OpenClaw agora é muito mais do que um assistente — é um **segundo cérebro pessoal** que lembra, aprende e cresce com você. 🧠✨
',
  'tool',
  ARRAY['openclaw', 'memória', 'segundo-cérebro', 'produtividade', 'obsidian', 'notion'],
  false,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'OpenClaw Multi-Agente: Clonagem e Escalação',
  'Aprenda a clonar e executar múltiplas instâncias do OpenClaw para família, empresa ou casos de uso específicos com orquestração centralizada.',
  '
# OpenClaw Multi-Agente: Clonagem e Escalação

Um OpenClaw é poderoso. Múltiplos OpenClaws coordenados são transformadores. Aprenda a clonar seu assistente para aplicações pessoais, familiares, empresariais e muito mais.

## Arquitetura Multi-Agente

```
┌────────────────────────────────────────────────────────┐
│           Orchestrator Central (HiveMind)              │
│  • Coordenação entre agentes                           │
│  • Compartilhamento de memória                         │
│  • Resolução de conflitos                              │
│  • Agregação de resultados                             │
└────────────────────────────────────────────────────────┘
        ▲         ▲         ▲         ▲         ▲
        │         │         │         │         │
   ┌────┴──┐ ┌───┴──┐ ┌───┴──┐ ┌───┴──┐ ┌───┴──┐
   │Claude │ │Claude│ │Claude│ │Claude│ │Claude│
   │  V1   │ │  V2  │ │  V3  │ │  V4  │ │  V5  │
   │(Você) │ │(Côn) │ │(Dev) │ │(Biz) │ │(Ops) │
   └───────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

## Clonando seu OpenClaw

### 1. Criar Cópia da Configuração

```bash
# Acessar diretório de configuração
cd ~/.openclaw

# Criar novo clone
openclaw clone --source default --target "openclaw-empresa" --profile empresa

# Ou manualmente
cp -r ~/.openclaw ~/.openclaw-familia
cp -r ~/.openclaw ~/.openclaw-empresa
```

### 2. Personalizar por Instância

Cada clone tem seu próprio `config.json`:

```json
{
  "id": "openclaw-empresa",
  "nome": "OpenClaw Corporativo",
  "descricao": "Assistente para gerenciamento da empresa",
  "versao": "1.0.0",
  
  "perfil": {
    "tipo": "corporativo",
    "setor": "tecnologia",
    "equipe_tamanho": 15,
    "linguagem": "pt-BR"
  },

  "memory": {
    "namespace": "empresa",
    "compartilhada": true,
    "encrypt": true
  },

  "skills": {
    "habilitadas": [
      "github-automation",
      "slack-integration",
      "jira-sync",
      "email-automation"
    ],
    "desabilitadas": ["personal-journal"]
  },

  "heartbeats": {
    "enabled": true,
    "timezone": "America/Sao_Paulo"
  },

  "integrações": {
    "slack": {
      "enabled": true,
      "workspace": "seu-workspace"
    },
    "github": {
      "enabled": true,
      "org": "sua-empresa"
    },
    "jira": {
      "enabled": true,
      "instancia": "sua-instancia.atlassian.net"
    }
  }
}
```

### 3. Inicializar Clone

```bash
# Inicializar nova instância
openclaw init --profile openclaw-empresa

# Ou via CLI
openclaw clone create \\
  --template empresa \\
  --nome "OpenClaw Empresa" \\
  --skills github,slack,jira \\
  --memory-compartilhada true
```

## Rodando Múltiplas Instâncias

### Método 1: Daemon Separados

```bash
# Terminal 1 - OpenClaw Pessoal
OPENCLAW_HOME=~/.openclaw openclaw daemon start

# Terminal 2 - OpenClaw Empresa
OPENCLAW_HOME=~/.openclaw-empresa openclaw daemon start

# Terminal 3 - OpenClaw Família
OPENCLAW_HOME=~/.openclaw-familia openclaw daemon start
```

### Método 2: Docker Containers

Crie um `docker-compose.yml`:

```yaml
version: ''3.8''

services:
  openclaw-personal:
    image: openclaw:latest
    environment:
      OPENCLAW_HOME: /home/openclaw/personal
      OPENCLAW_ID: personal
      PORT: 3001
    volumes:
      - ~/.openclaw:/home/openclaw/personal
    ports:
      - "3001:3000"
    
  openclaw-empresa:
    image: openclaw:latest
    environment:
      OPENCLAW_HOME: /home/openclaw/empresa
      OPENCLAW_ID: empresa
      PORT: 3002
    volumes:
      - ~/.openclaw-empresa:/home/openclaw/empresa
    ports:
      - "3002:3000"
    
  openclaw-familia:
    image: openclaw:latest
    environment:
      OPENCLAW_HOME: /home/openclaw/familia
      OPENCLAW_ID: familia
      PORT: 3003
    volumes:
      - ~/.openclaw-familia:/home/openclaw/familia
    ports:
      - "3003:3000"
    
  hive-coordinator:
    image: openclaw:coordinator
    environment:
      MODE: coordinator
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - openclaw-personal
      - openclaw-empresa
      - openclaw-familia
```

Start tudo com:
```bash
docker-compose up -d
```

## Coordenação HiveMind

O **Orchestrator Central** gerencia múltiplos agentes:

### Arquivo: hive-coordinator.js

```javascript
const EventEmitter = require(''events'');

/**
 * Coordenador central que gerencia múltiplos OpenClaws
 */
class HiveCoordinator extends EventEmitter {
  constructor(config = {}) {
    super();
    this.name = ''HiveCoordinator'';
    this.agentes = new Map();
    this.tarefas_compartilhadas = new Map();
    this.memoria_compartilhada = config.memoria_compartilhada || {};
    this.config = config;
  }

  /**
   * Registrar um agente na hive
   */
  async registrarAgente(id, agente) {
    this.agentes.set(id, {
      id,
      agente,
      status: ''ativo'',
      tarefas: 0,
      ultima_atividade: Date.now()
    });

    console.log(`✅ Agente ${id} registrado na Hive`);

    this.emit(''agente-registrado'', { id });
  }

  /**
   * Distribuir tarefa entre agentes
   */
  async distribuirTarefa(tarefa) {
    console.log(`📤 Distribuindo tarefa: ${tarefa.id}`);

    const agente = this.selecionarAgente(tarefa);

    if (!agente) {
      throw new Error(''Nenhum agente disponível'');
    }

    try {
      const resultado = await agente.agente.executar(tarefa);

      await this.registrarExecucao(tarefa.id, agente.id, resultado);

      return resultado;
    } catch (erro) {
      return this.tratarFalha(tarefa, agente, erro);
    }
  }

  /**
   * Selecionar melhor agente para tarefa
   */
  selecionarAgente(tarefa) {
    // Estratégia 1: Round-robin
    if (this.config.estrategia === ''round-robin'') {
      const agentes_ativos = Array.from(this.agentes.values())
        .filter(a => a.status === ''ativo'');
      
      return agentes_ativos[0];
    }

    // Estratégia 2: Menos carga
    if (this.config.estrategia === ''menos-carga'') {
      return Array.from(this.agentes.values())
        .filter(a => a.status === ''ativo'')
        .sort((a, b) => a.tarefas - b.tarefas)[0];
    }

    // Estratégia 3: Especialista
    if (this.config.estrategia === ''especialista'') {
      return Array.from(this.agentes.values())
        .filter(a => 
          a.agente.especialidades?.includes(tarefa.tipo)
        )[0];
    }

    return Array.from(this.agentes.values())[0];
  }

  /**
   * Compartilhar memória entre agentes
   */
  async compartilharMemoria(chave, valor) {
    this.memoria_compartilhada[chave] = {
      valor,
      timestamp: Date.now(),
      compartilhado_por: ''hive''
    };

    // Notificar todos os agentes
    for (const [id, agente] of this.agentes) {
      try {
        await agente.agente.receberMemoriaCompartilhada(chave, valor);
      } catch (erro) {
        console.warn(`Erro ao notificar ${id}:`, erro.message);
      }
    }
  }

  /**
   * Consultar memória compartilhada
   */
  obterMemoriaCompartilhada(chave) {
    return this.memoria_compartilhada[chave];
  }

  /**
   * Executar tarefa distribuída com múltiplos agentes
   */
  async executarDistribuido(tarefas, estrategia = ''paralelo'') {
    console.log(`🔄 Executando ${tarefas.length} tarefas em modo ${estrategia}`);

    if (estrategia === ''paralelo'') {
      // Todos ao mesmo tempo
      const promessas = tarefas.map(t => this.distribuirTarefa(t));
      return Promise.all(promessas);
    }

    if (estrategia === ''sequencial'') {
      // Um por um
      const resultados = [];
      for (const tarefa of tarefas) {
        const resultado = await this.distribuirTarefa(tarefa);
        resultados.push(resultado);
      }
      return resultados;
    }

    if (estrategia === ''pipeline'') {
      // Saída de um = entrada do próximo
      let resultado = null;
      for (const tarefa of tarefas) {
        tarefa.entrada = resultado;
        resultado = await this.distribuirTarefa(tarefa);
      }
      return resultado;
    }
  }

  /**
   * Agregar resultados de múltiplos agentes
   */
  async agregarResultados(tarefa_id) {
    const resultados = Array.from(this.tarefas_compartilhadas.values())
      .filter(t => t.tarefa_id === tarefa_id);

    return {
      resultados_individuais: resultados.map(r => r.resultado),
      resumo: this.gerarResumo(resultados),
      timestamp: Date.now()
    };
  }

  /**
   * Resolver conflitos entre agentes
   */
  async resolverConflito(conflito) {
    console.log(`⚠️ Resolvendo conflito: ${conflito.id}`);

    // Estratégia 1: Votação
    if (this.config.resolver_por === ''votacao'') {
      const votos = {};

      for (const [id, agente] of this.agentes) {
        const voto = await agente.agente.votar(conflito);
        votos[id] = voto;
      }

      const vencedor = Object.keys(votos).reduce((a, b) =>
        votos[a] > votos[b] ? a : b
      );

      return {
        resolvido_por: ''votacao'',
        vencedor,
        resultado: votos[vencedor]
      };
    }

    // Estratégia 2: Especialista
    if (this.config.resolver_por === ''especialista'') {
      const especialista = Array.from(this.agentes.values())
        .find(a => a.agente.especialidades?.includes(conflito.tipo));

      return {
        resolvido_por: ''especialista'',
        especialista: especialista.id,
        resultado: await especialista.agente.resolver(conflito)
      };
    }
  }

  /**
   * Monitorar saúde dos agentes
   */
  async monitorarAgentes() {
    console.log(''🏥 Monitorando saúde da Hive...'');

    const relatorio = {
      total_agentes: this.agentes.size,
      agentes_ativos: 0,
      agentes_inativos: 0,
      detalhes: []
    };

    for (const [id, agente] of this.agentes) {
      const saude = await agente.agente.verificarSaude();

      if (saude.status === ''ativo'') {
        relatorio.agentes_ativos++;
      } else {
        relatorio.agentes_inativos++;
      }

      relatorio.detalhes.push({
        id,
        status: saude.status,
        uptime: saude.uptime,
        memoria_uso: saude.memoria,
        tarefas_completas: agente.tarefas
      });
    }

    return relatorio;
  }

  // Métodos auxiliares
  async registrarExecucao(tarefa_id, agente_id, resultado) {
    this.tarefas_compartilhadas.set(`${tarefa_id}-${agente_id}`, {
      tarefa_id,
      agente_id,
      resultado,
      timestamp: Date.now()
    });
  }

  async tratarFalha(tarefa, agente, erro) {
    console.error(`❌ Erro no agente ${agente.id}:`, erro);

    // Tentar com outro agente
    if (tarefa.retries < (this.config.max_retries || 3)) {
      tarefa.retries = (tarefa.retries || 0) + 1;
      const outro_agente = this.selecionarAgente(tarefa);

      if (outro_agente && outro_agente.id !== agente.id) {
        console.log(`🔄 Retentando com ${outro_agente.id}...`);
        return this.distribuirTarefa(tarefa);
      }
    }

    return {
      sucesso: false,
      erro: erro.message,
      agente_falhado: agente.id
    };
  }

  gerarResumo(resultados) {
    const sucessos = resultados.filter(r => r.resultado.sucesso).length;
    const falhas = resultados.length - sucessos;

    return {
      total: resultados.length,
      sucessos,
      falhas,
      taxa_sucesso: `${(sucessos / resultados.length * 100).toFixed(2)}%`
    };
  }
}

module.exports = HiveCoordinator;
```

## Casos de Uso

### 1. Família

```javascript
const coordinador = new HiveCoordinator({
  tipo: ''familia'',
  estrategia: ''menos-carga''
});

// Criar instâncias para cada pessoa
await coordinador.registrarAgente(''pai'', new OpenClaw({
  nome: ''OpenClaw Papai'',
  contexto: ''Gerenciar finanças familiares e projetos''
}));

await coordinador.registrarAgente(''mae'', new OpenClaw({
  nome: ''OpenClaw Mamãe'',
  contexto: ''Organizar casa, compras, agenda''
}));

await coordinador.registrarAgente(''filho'', new OpenClaw({
  nome: ''OpenClaw Filho'',
  contexto: ''Ajudar com estudos''
}));

// Compartilhar agenda familiar
await coordinador.compartilharMemoria(''agenda-familiar'', {
  eventos: [
    { data: ''2026-03-01'', evento: ''Aniversário avó'' },
    { data: ''2026-03-15'', evento: ''Reunião de pais'' }
  ]
});

// Distribuir tarefa: "Planejar férias"
const resultado = await coordinador.distribuirTarefa({
  id: ''plan-ferias'',
  tipo: ''planejamento'',
  descricao: ''Planejar férias em julho''
});
```

### 2. Empresa

```javascript
const hive = new HiveCoordinator({
  tipo: ''empresa'',
  estrategia: ''especialista'',
  resolver_por: ''votacao''
});

// Diferentes departamentos
await hive.registrarAgente(''dev-lead'', new OpenClaw({
  especialidades: [''desenvolvimento'', ''arquitetura''],
  skills: [''github'', ''code-review'']
}));

await hive.registrarAgente(''devops'', new OpenClaw({
  especialidades: [''infraestrutura'', ''deployment''],
  skills: [''docker'', ''kubernetes'', ''monitoring'']
}));

await hive.registrarAgente(''product'', new OpenClaw({
  especialidades: [''produto'', ''roadmap''],
  skills: [''jira'', ''analytics'']
}));

await hive.registrarAgente(''sales'', new OpenClaw({
  especialidades: [''vendas'', ''clientes''],
  skills: [''salesforce'', ''email'']
}));

// Tarefas departamentais
await hive.executarDistribuido([
  { id: ''t1'', tipo: ''desenvolvimento'', descricao: ''Code review PR #123'' },
  { id: ''t2'', tipo: ''deployment'', descricao: ''Deploy para produção'' },
  { id: ''t3'', tipo: ''produto'', descricao: ''Atualizar roadmap'' }
], ''paralelo'');

// Monitorar saúde
const relatorio = await hive.monitorarAgentes();
console.log(relatorio);
```

### 3. Agência/Freelancer

```javascript
// Um OpenClaw para cada cliente
const clientes = [''cliente-a'', ''cliente-b'', ''cliente-c''];

const hive = new HiveCoordinator({
  tipo: ''agencia'',
  estrategia: ''round-robin''
});

for (const cliente of clientes) {
  await hive.registrarAgente(cliente, new OpenClaw({
    nome: `OpenClaw ${cliente}`,
    contexto: `Assistente dedicado para ${cliente}`
  }));
}

// Distribuir demandas
const demandas = [
  { id: ''dem-1'', cliente: ''cliente-a'', descricao: ''Desenvolver feature X'' },
  { id: ''dem-2'', cliente: ''cliente-b'', descricao: ''Bug fixing'' },
  { id: ''dem-3'', cliente: ''cliente-c'', descricao: ''Consultoria arquitetura'' }
];

for (const demanda of demandas) {
  await hive.distribuirTarefa(demanda);
}
```

## Recursos e Custos

### Consumo por Instância

| Recurso | Por Instância | 5 Instâncias |
|---------|--------------|--------------|
| Memória RAM | 256 MB | 1.25 GB |
| Disco | 500 MB | 2.5 GB |
| CPU | Baixo (idle) | Médio |
| API/chamadas | ~1000/mês | ~5000/mês |

### Custos de API (Claude Haiku)

| Volume | Custo | 5 Instâncias |
|--------|-------|--------------|
| 100k tokens | ~$0.04 | ~$0.20 |
| 1M tokens | ~$0.40 | ~$2.00 |
| 10M tokens | ~$4.00 | ~$20.00 |

### Hardware Recomendado

```
Pessoal (1-2 instâncias)
├─ CPU: 2 cores
├─ RAM: 4 GB
└─ Disco: 20 GB

Pequeno time (3-5 instâncias)
├─ CPU: 4 cores
├─ RAM: 8-16 GB
└─ Disco: 50 GB

Empresa (10+ instâncias)
├─ CPU: 8+ cores
├─ RAM: 32+ GB
├─ Disco: 200+ GB
└─ Load balancer
```

## Sincronização de Memória

```javascript
/**
 * Sincronizar memórias entre instâncias
 */
class MemoriaCompartilhada {
  constructor(instancias) {
    this.instancias = instancias;
    this.central = {};
  }

  async sincronizar() {
    // Coletar todas as memórias
    for (const inst of this.instancias) {
      const memorias = await inst.memory.getAll();
      
      for (const mem of memorias) {
        if (mem.metadata?.compartilhada) {
          this.central[mem.id] = mem;
        }
      }
    }
  }

  async propagarMudanca(key, valor) {
    // Atualizar em todas as instâncias
    const promessas = this.instancias.map(inst =>
      inst.memory.set(key, valor)
    );

    await Promise.all(promessas);
  }

  async buscar(query) {
    // Buscar em todas as memórias
    const resultados = [];

    for (const inst of this.instancias) {
      const matches = await inst.memory.search(query);
      resultados.push(...matches);
    }

    return resultados;
  }
}
```

## Monitoramento e Logs

```javascript
// Centralizar logs
const winston = require(''winston'');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: ''~/.openclaw/logs/all-instances.log''
    }),
    new winston.transports.File({
      filename: ''~/.openclaw/logs/errors.log'',
      level: ''error''
    })
  ]
});

// Cada instância loga para arquivo centralizado
class OpenClawComLog {
  log(agente_id, mensagem, nivel = ''info'') {
    logger.log({
      level: nivel,
      message: mensagem,
      agente: agente_id,
      timestamp: new Date().toISOString()
    });
  }
}
```

## Boas Práticas

✅ **Recomendado:**
- Usar Docker para isolamento
- Coordenador centralizado
- Memória compartilhada para dados críticos
- Monitoramento contínuo
- Backups regulares
- Logging centralizado

❌ **Evitar:**
- Muitas instâncias sem coordenação
- Conflitos de escrita em memória
- Sem isolamento de recursos
- Falta de monitoramento
- Replicação de dados críticos

---

Escale seu OpenClaw do pessoal para empresarial! 🚀
',
  'tool',
  ARRAY['openclaw', 'multi-agente', 'escalação', 'clonagem', 'coordenação', 'swarm'],
  false,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'Primeiros Passos com OpenClaw: Guia de Produtividade',
  '10 primeiros comandos para testar OpenClaw. Aprenda a criar tarefas, lembretes, resumos diários e automatizar sua rotina.',
  '
# Primeiros Passos com OpenClaw: Guia de Produtividade

Você instalou OpenClaw e conectou a uma plataforma de mensagem. Agora aprenda os 10 comandos mais úteis para aumentar sua produtividade imediatamente.

## 1️⃣ Comando 1: Saudação Básica

Comece com o básico!

```
oi OpenClaw
```

**O que ele faz:**
- Confirma que está funcionando
- Se apresenta
- Oferece ajuda

**Resposta esperada:**
```
Olá! Sou seu assistente pessoal OpenClaw. 
Estou aqui para ajudar com tarefas, lembretes, 
emails, calendário e muito mais.

Como posso ajudá-lo?
```

---

## 2️⃣ Comando 2: Criar Tarefa Simples

A tarefa mais útil do dia a dia.

```
criar tarefa: estudar React até sexta
```

Ou:
```
nova tarefa: entregar projeto do cliente
```

**O que ele faz:**
- Cria uma tarefa em sua lista
- Define automaticamente a data (hoje ou data mencionada)
- Salva para você não esquecer

**Resposta esperada:**
```
✓ Tarefa criada com sucesso!
📋 Estudar React até sexta
⏰ Prazo: 28 de fevereiro
Status: Aberta
```

**Dica:** Especifique a data para melhor gerenciamento:
```
criar tarefa: entregar relatório até 1º de março
```

---

## 3️⃣ Comando 3: Listar Tarefas

Veja tudo que precisa fazer.

```
minhas tarefas
```

Ou:
```
listar tarefas
```

Ou:
```
quais são minhas tarefas de hoje?
```

**O que ele faz:**
- Mostra todas as tarefas abertas
- Ordena por prioridade/data
- Destaca tarefas vencidas

**Resposta esperada:**
```
📋 Suas Tarefas:

🔴 URGENTE (vencidas):
  - Terminar apresentação

🟡 HOJE:
  - Estudar React
  - Responder emails do cliente

🟢 PRÓXIMOS DIAS:
  - Planejar viagem
  - Ler artigo sobre IA
```

---

## 4️⃣ Comando 4: Marcar Tarefa como Feita

Celebre cada conclusão!

```
marcar tarefa como feita: estudar React
```

Ou:
```
completar tarefa: responder emails
```

**O que ele faz:**
- Remove da lista de tarefas
- Registra conclusão
- Mostra progresso

**Resposta esperada:**
```
✅ Tarefa concluída!
🎉 Você completou: Estudar React
Próxima tarefa: Responder emails do cliente
```

---

## 5️⃣ Comando 5: Criar Lembretes

Para não esquecer do importante.

```
me lembre para ligar para mãe amanhã às 15h
```

Ou:
```
criar lembrete: tomar medicamento todo dia às 8h da manhã
```

**O que ele faz:**
- Cria lembretes no horário especificado
- Manda mensagem (WhatsApp/Telegram/Discord)
- Pode ser recorrente (diário, semanal)

**Resposta esperada:**
```
⏰ Lembrete criado!
📢 Ligar para mãe
🕐 Amanhã às 15:00
Status: Ativo
```

**Tipos de lembretes:**
```
me lembre em 30 minutos
me lembre amanhã às 9h
me lembre todo dia às 7h
me lembre na próxima sexta
```

---

## 6️⃣ Comando 6: Verificar Agenda

Saiba o que vem por aí.

```
qual é minha agenda hoje?
```

Ou:
```
tenho reuniões amanhã?
```

Ou:
```
mostrar meu calendário desta semana
```

**O que ele faz:**
- Mostra eventos do Google Calendar
- Horários e participantes
- Avisa sobre conflitos

**Resposta esperada:**
```
📅 Sua Agenda de Hoje:

09:00 - Reunião de planejamento
        Participantes: João, Maria
        Local: Sala 301

14:00 - 1:1 com gerente
        Online via Meet

16:30 - Standup do time
        Sala 201
```

---

## 7️⃣ Comando 7: Criar Evento no Calendário

Adicione compromissos direto.

```
criar evento: reunião com cliente em 15 de março às 10h
```

Ou:
```
agendar: café com amigo amanhã às 16h
```

**O que ele faz:**
- Cria evento no Google Calendar
- Define hora e data
- Pode adicionar participantes

**Resposta esperada:**
```
📅 Evento criado com sucesso!
Reunião com cliente
📍 15 de março às 10:00
🔗 Link do evento adicionado
✉️ Convites enviados
```

---

## 8️⃣ Comando 8: Ler Emails Importantes

Acompanhe mensagens importantes.

```
ler meus emails
```

Ou:
```
mostrar últimos 5 emails
```

Ou:
```
emails do [pessoa/empresa]
```

**O que ele faz:**
- Mostra emails recentes
- Destaca importantes
- Resume conteúdo

**Resposta esperada:**
```
✉️ Seus Últimos Emails:

🔴 [IMPORTANTE] - seu-chefe@company.com
    Assunto: Feedback do projeto
    Resumo: Projeto aprovado com observações...

- seu-cliente@company.com
  Assunto: Dúvidas sobre proposta
  Resumo: Cliente solicita esclarecimentos...
```

---

## 9️⃣ Comando 9: Morning Briefing (Resumo Diário)

Comece o dia informado.

```
meu resumo diário
```

Ou:
```
briefing de hoje
```

**O que ele faz:**
- Combina agenda, tarefas e emails
- Oferece visão geral do dia
- Destaca prioridades

**Resposta esperada:**
```
☀️ SEU RESUMO DE HOJE - 24 de fevereiro

📊 Resumo:
   • 3 tarefas para fazer
   • 2 reuniões agendadas
   • 5 emails importantes

⏰ Reuniões Hoje:
   09:00 - Planejamento semanal
   14:00 - 1:1 com gerente

📋 Tarefas Críticas:
   🔴 Terminar apresentação
   🔴 Responder RFP do cliente

✉️ Emails Importantes:
   - Marketing: Nova campanha
   - CEO: Feedback do quarto trimestre

🎯 Foco: Priorize apresentação e RFP!
```

**Configurar para cada manhã:**
```
configure briefing automático para 8h da manhã
```

---

## 🔟 Comando 10: Procurar/Pesquisar

Encontre informações rapidamente.

```
procure email sobre o projeto XYZ
```

Ou:
```
quando é minha reunião com [pessoa]?
```

Ou:
```
tenho algo anotado sobre [tema]?
```

**O que ele faz:**
- Busca em emails, tarefas, calendário
- Encontra informações relevantes
- Economiza tempo

**Resposta esperada:**
```
🔍 Resultados da Busca: "projeto XYZ"

📧 Emails (2 encontrados):
   - Email 1: "XYZ - Proposta enviada"
   - Email 2: "XYZ - Feedback do cliente"

📅 Calendário (1 encontrado):
   - Reunião de progresso XYZ
   - 25 de fevereiro às 10h

📋 Tarefas (1 encontrada):
   - Iniciar projeto XYZ
```

---

## Práticas Avançadas para Produtividade

### Priorizar Tarefas

```
marcar como importante: terminar apresentação
```

Usa no Morning Briefing com destaque.

### Definir Prioridade

```
tarefa de alta prioridade: projeto urgente
tarefa de baixa prioridade: leitura opcional
```

### Organizar por Categoria

```
criar tarefa [categoria]: [descrição]

Exemplos:
- criar tarefa trabalho: terminar relatório
- criar tarefa pessoal: ir à academia
- criar tarefa estudo: ler artigo sobre React
```

### Agrupar Tarefas do Dia

```
planeje meu dia
```

O assistente sugerirá uma ordem de execução baseada em importância.

### Rastreamento de Hábitos

```
registrar hábito: exercício - 30 minutos
```

### Notas Rápidas

```
anotar: ideia para novo projeto de IA
```

---

## Fluxo de Trabalho Recomendado

### ☀️ Manhã (8:00)
```
"meu resumo diário"
```
Veja tudo que precisa fazer.

### 🎯 Antes de Começar
```
"planeje meu dia"
```
Organize prioridades.

### ✅ Ao Completar
```
"marcar como feita: [tarefa]"
```
Registre progresso.

### 🌙 À Noite
```
"tarefas de amanhã"
```
Prepare para o próximo dia.

---

## Atalhos Úteis

Configure aliases para comandos frequentes. No seu arquivo de configuração:

```
ALIASES:
  !tarefas   → minhas tarefas
  !resumo    → meu resumo diário
  !email     → ler meus emails
  !agenda    → qual é minha agenda?
  !nova      → criar tarefa
  !feita     → marcar como feita
  !lembrete  → me lembre
  !evento    → criar evento
```

Depois, use apenas:
```
!tarefas
!resumo
!email
```

---

## Automações Inteligentes

### Auto-resumo de Emails
```
configure resumos automáticos de emails
resumo em português, máximo 2 linhas cada
```

### Lembretes de Tarefas Vencidas
```
notifique-me sobre tarefas vencidas
mostrar a cada 12 horas
```

### Blocos de Foco
```
quando estou em "foco" mode
silenciar notificações de emails
manter tarefas atualizadas
```

Ative com:
```
começar bloco de foco: 2 horas
```

---

## Dicas Pro

### 1️⃣ Seja Específico
**Ruim:** "preciso fazer coisas"
**Bom:** "criar tarefa: estudar Redux até sexta"

### 2️⃣ Use Datas Claras
**Ruim:** "lembrar depois"
**Bom:** "me lembre amanhã às 10h"

### 3️⃣ Revise Regularmente
Execute `meu resumo diário` toda manhã para manter foco.

### 4️⃣ Archive Tarefas Completas
Não acumule tarefas antigas na lista.

### 5️⃣ Use Categorias
Organize tarefas por área (trabalho, pessoal, estudo).

---

## Troubleshooting Comum

### "Ele não criou a tarefa"
- Tente: "criar tarefa: [descrição exata]"
- Verifique se tem data/hora clara
- Tente rephrasing: "nova tarefa" vs "criar tarefa"

### "Lembretes não chegam"
- Verifique se app de mensagem está aberto
- Confirme permissões de notificação
- Tente criar outro lembrete para testar

### "Calendar não mostra eventos"
- Verifique se Google Calendar está conectado (próximo tutorial)
- Confirme eventos existem no calendário
- Tente "qual é minha agenda de amanhã?"

### "Emails não aparecem"
- Confirme Gmail está conectado
- Tente "ler meus últimos emails"
- Verifique permissões do Gmail

---

## Próximas Melhorias

Com esses 10 comandos básicos, você está pronto para:

1. **Integrar Gmail/Calendar** → [Tutorial de Integração](/como-conectar-openclaw-gmail-calendar)
2. **Criar Automações Avançadas** → Documentação oficial
3. **Conectar a Slack/Teams** → Documentação oficial
4. **Usar AI para Análise** → Recursos avançados

---

## Recursos

- 📚 **Documentação Oficial**: https://openclaw.ai/docs
- 💬 **Comunidade**: https://discord.gg/openclaw
- 🐛 **Issues/Bugs**: https://github.com/ruvnet/openclaw/issues
- 💡 **Ideias de Automações**: [Fórum OpenClaw](https://github.com/ruvnet/openclaw/discussions)

---

## Conclusão

Você agora tem tudo que precisa para começar com OpenClaw!

**Próximos passos:**
1. ✅ Use esses 10 comandos hoje
2. ✅ Integre Gmail e Calendar
3. ✅ Configure lembretes automáticos
4. ✅ Explore automações avançadas

**Lembre-se:** OpenClaw funciona melhor quanto mais você o usa. Quanto mais comandos você executar, melhor ele entenderá seus padrões!

---

Dúvidas? Junte-se à [comunidade OpenClaw no Discord](https://discord.gg/openclaw)! 🚀
',
  'tool',
  ARRAY['openclaw', 'produtividade', 'comandos', 'automação', 'tutorial'],
  true,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'OpenClaw é o Início da Revolução dos Assistentes Pessoais',
  'Análise de por que OpenClaw representa uma mudança fundamental no mercado de assistentes de IA pessoais',
  '
# OpenClaw é o Início da Revolução dos Assistentes Pessoais

Vivemos um momento histórico e poucos percebem. A luta pelo controle dos assistentes de IA pessoais está começando. E OpenClaw é o primeiro movimento de resistência genuína.

## Por Que OpenClaw é Diferente

Não é apenas um assistente a mais. É uma mudança de paradigma.

### O Problema das Walled Gardens

Apple, Google, Amazon criaram assistentes que vivem dentro de suas propriedades privadas. São jardins fechados onde você não controla nada:

- Seus dados não são seus
- Você não vê o código
- Não pode customizar
- Mudanças impostas de cima para baixo
- Dependência de infraestrutura corporativa

Esses assistentes são **grátis porque você é o produto**.

### A Proposta do OpenClaw

OpenClaw quebra o modelo:

- **Código aberto**: Você vê exatamente o que está rodando
- **Roda localmente**: Seus dados nunca deixam seu computador
- **Customizável**: Você modifica conforme precisa
- **Gratuito realmente**: Você paga apenas por APIs, não por dados
- **Descentralizado**: Não depende de nenhuma corporação
- **Auto-evolutivo**: O assistente cria suas próprias extensões

Isso não é incremental. É revolucionário.

## Open Source vs Walled Gardens

O debate sobre open source vs proprietário é antigo na tech. Mas em IA pessoal é crítico.

### Por Que Open Source Importa em IA

Com código fechado, você confiar cegamente. Você não sabe:

- Que dados está sendo coletado
- Como seus dados são usados
- Se há backdoors
- Quando suas privacidades mudam
- Se há discriminação em respostas

**Exemplo real**: Google foi descoberto gravando áudio mesmo sem ativar o Google Assistant. Usuários nunca souberam.

Com OpenClaw, qualquer pessoa pode auditar. Um desenvolvedor suspeito? Mude para uma versão auditada. Quer adicionar funcionalidade? Você mesmo adiciona.

### A Economia da Privacidade

Corporações têm incentivos errados:

- Monetizar dados = coletam o máximo
- Publicidade é receita = precisam de perfil seu
- Lock-in é modelo = quanto mais dependente, melhor

OpenClaw inverte a economia:

- Sem modelo de publicidade
- Sem incentivo para coletar dados
- Lucro através de transparência, não exploração
- Seu interesse é meu interesse

## Impacto em Startups de Assistentes

Há dezenas de startups tentando competir com assistentes de IA. Todas enfrentam o mesmo problema: como competir com Google, Apple, Amazon que têm infraestrutura gigante?

OpenClaw oferece um caminho alternativo:

1. **Não compete em escala**: Compete em privacidade
2. **Não precisa venture capital gigante**: Open source é collaborative
3. **Não precisa de serverless**: Roda na máquina do usuário
4. **Pode inovar mais rápido**: Comunidade contribui
5. **Não precisa de moat corporativo**: A qualidade do código é o moat

Startups que entendem isso podem construir no topo de OpenClaw em vez de tentar competir diretamente. Ecossistema vs monopólio.

### Exemplos de Startups Emergindo

Já existem projetos construindo no topo de OpenClaw:

- **Skills especializadas**: Para áreas específicas (contabilidade, saúde, direito)
- **Hosting providers**: Para quem não quer servidor próprio
- **Mobile clients**: Aplicativos iOS/Android que sincronizam com OpenClaw
- **Enterprise versions**: Para corporações que querem privacidade

O efeito rede está começando.

## O Futuro dos Assistentes Pessoais

Se OpenClaw vencer (e sinais indicam que pode), o futuro é assim:

### Cenário 1: Descentralização
- Você roda seu assistente localmente
- Diferentes "distribuições" otimizadas para diferentes casos
- Mercado de skills ao invés de controlador central
- Assistentes verdadeiramente seus

### Cenário 2: Padrões Abertos
- Como HTTP revolucionou web
- Padrões abertos para assistentes criarão ecossistema
- OpenClaw se torna "o Linux dos assistentes"
- Interoperabilidade, não lock-in

### Cenário 3: Regulação
- Governos percebem o risco de monopólios
- Regulação força abertura
- Startups saem de garagens para competir
- Inovação acelera

## Implicações para Apple, Google, Amazon

Essas corporações percebem a ameaça. Então estão fazendo moves defensivos:

### Apple
- "On-device processing" (mas ainda cloud quando precisa)
- Privacy-first marketing
- Mantém lock-in através de conveniência
- **Risco**: Perder developers progressivamente

### Google
- Investindo em open source (Gemma, etc)
- Mas mantendo data collection
- Tentando copiar privacidade sem mudar modelo
- **Risco**: Falha se privacidade virar commodity

### Amazon
- Alexa skills permitem extensões
- Mas controla o marketplace central
- Data collection permanece
- **Risco**: Mais vulnerável, menos integração nativa

**A estratégia deles**: Abraçar open source em nível superficial mas manter controle de dados e ecossistema.

OpenClaw os força a competir em qualidade real, não em lock-in.

## A Grande Questão: OpenClaw Vai Escalar?

Alguns questionam: "Mas OpenClaw pode mesmo competir em escala?"

Resposta curta: não precisa.

Precisa apenas crescer o suficiente para:
1. Ser a escolha padrão entre entusiastas
2. Inspirar competidores abertos
3. Forçar regulação
4. Criar padrões que os corporativos devem seguir

**Um precedente histórico**: Linux nunca foi "melhor" que Unix comercial. Mas foi suficientemente bom, gratuito e aberto. Hoje Linux roda 96% do mercado de cloud.

OpenClaw não precisa vencer no smartphone do seu avó. Precisa vencer entre developers. E isso está acontecendo.

## O Que Está Em Jogo

Não é apenas sobre assistentes.

É sobre:
- **Privacidade**: Quem controla seus dados?
- **Propriedade**: Você dono do seu software ou aluga?
- **Inovação**: Quem inova? Corporações ou comunidade?
- **Poder**: Quem decide como você interage com IA?

## Conclusão

OpenClaw representa o começo do fim da era dos walled gardens.

Não porque vai dominar o mercado. Mas porque demonstrou algo crucial: é possível fazer assistentes melhores, mais privados, mais customizáveis, sendo open source.

Uma vez que você vê isso é possível, volta atrás é politicamente impossível.

Os próximos 5 anos vão determinar se essa revolução escala. Mas as sementes já foram plantadas.

## O que Fazer Agora

1. **Comece a seguir o projeto** no GitHub e receba atualizações
2. **Experimente localmente** antes de depender de assistentes proprietários
3. **Considere contribuir** se é desenvolvedor interessado em privacidade
4. **Compartilhe com outros** que se preocupam com dados
',
  'analysis',
  ARRAY['openclaw', 'ia', 'open-source', 'privacidade', 'análise-mercado', 'futuro'],
  true,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'OpenClaw vs Devin: Agentes Autônomos vs Assistentes Pessoais',
  'Comparativo técnico entre OpenClaw e Devin: qual a diferença entre agente autônomo e assistente pessoal',
  '
# OpenClaw vs Devin: Agentes Autônomos vs Assistentes Pessoais

Há uma confusão comum: comparar OpenClaw e Devin como se fossem concorrentes. Não são. São soluções para problemas diferentes.

Uma confusão que precisa ser desfeita: ambos são "agentes de IA", mas servem propósitos completamente diferentes.

## O Que é Devin?

Devin é um agente autônomo de software engineer. Seu trabalho:

- Escrever código
- Debugar aplicações
- Executar testes
- Fazer deploy
- Trabalhar em repositórios

É um desenvolvedor de IA. Você dá tarefas de código e Devin executa.

## O Que é OpenClaw?

OpenClaw é um assistente pessoal. Seu trabalho:

- Gerenciar sua vida pessoal
- Ler/responder emails
- Agendar compromissos
- Integrar seus serviços
- Aprender seus padrões

É seu ajudante pessoal. Você conversa naturalmente.

## Comparação: Diferenças Fundamentais

| Aspecto | Devin | OpenClaw |
|---------|-------|----------|
| **Tipo** | Agente autônomo especializado | Assistente pessoal genérico |
| **Escopo** | Desenvolvimento de software | Vida pessoal |
| **Interface** | Tarefas específicas | Conversa natural |
| **Autonomia** | Alta (roda sozinho) | Média (você dirige) |
| **Ambiente** | Terminal, repositórios | Aplicativos pessoais |
| **Acesso** | Código, APIs dev | Email, calendar, mensagens |
| **Modelo Devin** | Cloud-based (pago) | OpenClaw é open-source |
| **Inteligência Requerida** | Muito técnica (código) | Geral (conversação) |

## Quando Usar Cada Um

### Use Devin Quando:
- Precisa automatizar tarefas de desenvolvimento
- Tem bugs para debugar
- Quer alguém para refatorar código
- Precisa escrever testes
- Tem backlog técnico infinito

Exemplo: "Devin, implemente autenticação OAuth em minha API"

### Use OpenClaw Quando:
- Quer gerenciar seu dia melhor
- Precisa lembrar de pagar contas
- Quer organizar emails automaticamente
- Deseja agendar reuniões via chat
- Quer um assistente que aprenda seus hábitos

Exemplo: "OpenClaw, agende a reunião com João para próxima terça depois da reunião de produto"

## Arquitetura Técnica

### Devin

```
INPUT (Tarefa)
    ↓
Planejamento (quebra em subtarefas)
    ↓
Execução (roda comandos, escreve código)
    ↓
Teste (valida resultado)
    ↓
Iteração (se falhar, tenta novamente)
    ↓
OUTPUT (Código pronto)
```

Devin é uma máquina de estado orientada a tarefas.

### OpenClaw

```
INPUT (Conversa natural)
    ↓
Processamento de Linguagem
    ↓
Compreensão de Contexto (memória histórica)
    ↓
Decisão de Ação (o que fazer)
    ↓
Execução Contextualizada
    ↓
Resposta Natural
    ↓
Aprendizado (memória para próxima vez)
```

OpenClaw é um loop de conversação com memória.

## Privacidade: O Grande Diferencial

### Devin
- **Cloud-based**: Seus repositórios vão para servidores deles
- **Pago**: Você paga pelo acesso
- **Proprietário**: Código deles é fechado
- **Ideal para**: Empresas que podem aceitar compartilhar código
- **Risco**: Vender acesso a treinamento de seus repositórios

### OpenClaw
- **Local**: Roda na sua máquina
- **Gratuito**: Paga apenas por APIs
- **Open source**: Você vê tudo
- **Ideal para**: Indivíduos, startups, empresas paranóicas com IP
- **Vantagem**: Seus dados nunca deixam seu computador

## Preço

### Devin
- **Freemium**: Alguns usos gratuitos
- **Pago**: ~$500/mês para uso enterprise
- **Modelo**: Por execução/hora de agente

### OpenClaw
- **Gratuito**: Código open source
- **Custos**: Apenas APIs usadas ($5-100/mês típico)
- **Modelo**: Você paga infraestrutura, não o software

Para developers individuais, OpenClaw é muito mais barato.

## Capacidades Técnicas

### Devin é Melhor Em:
- Escrever código de produção (treinado especificamente)
- Debugar aplicações complexas
- Entender repositórios inteiros
- Executar testes de forma confiável
- Integrar com sistemas de CI/CD

### OpenClaw é Melhor Em:
- Entender contexto pessoal
- Aprender padrões individuais
- Integrar múltiplos serviços pessoais
- Executar de forma confiável 24/7
- Ser genuinamente privado

## Possível Integração

Aqui está uma ideia interessante: combinar ambos.

OpenClaw poderia coordenar Devin:

```
Você: "OpenClaw, preciso que Devin implemente testes para o projeto X"
OpenClaw: (entende contexto, encontra projeto X)
OpenClaw: (dispara Devin com instrução específica)
OpenClaw: (monitora progresso)
OpenClaw: (notifica você quando terminar)
OpenClaw: (integra resultado na sua rotina)
```

Essa integração não existe ainda, mas seria natural.

## O Mercado

Há espaço para ambos:

### Devin Vence Com:
- Startups de tech
- Equipes de desenvolvimento
- Desenvolvimento acelerado de MVP
- Prototipagem rápida

### OpenClaw Vence Com:
- Indivíduos
- Usuários preocupados com privacidade
- Pessoas em profissões não-tech
- Quem quer assistente realmente customizado

Não são concorrentes diretos. Servem mercados diferentes.

## Qual É Melhor?

Depende do seu trabalho.

**Se você escreve código e quer automação**: Devin.

**Se você quer um assistente que cuide da sua vida pessoal**: OpenClaw.

A pergunta certa não é "qual é melhor?" mas "qual resolve meu problema?"

## Conclusão

OpenClaw e Devin representam duas direções diferentes de IA prática:

- **Devin** é especialização: muito bom em uma coisa (código)
- **OpenClaw** é generalização: bom em muitas coisas pessoais

No futuro ideal, os dois existem e se integram. Devin cuida do seu trabalho técnico. OpenClaw cuida de tudo mais.

## O que Fazer Agora

1. **Se é desenvolvedor**: Teste Devin para problemas técnicos específicos
2. **Se quer assistente pessoal**: Comece com OpenClaw
3. **Se é ambos**: Use ambos em paralelo para casos de uso diferentes
',
  'analysis',
  ARRAY['openclaw', 'devin', 'agentes-autonomos', 'ia', 'comparativo', 'arquitetura'],
  false,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'OpenClaw vs Siri vs Google Assistant vs Alexa: Comparativo Detalhado',
  'Comparativo completo entre OpenClaw, Siri, Google Assistant e Alexa. Privacidade, features e quando usar cada um',
  '
# OpenClaw vs Siri vs Google Assistant vs Alexa

A escolha de um assistente pessoal de IA é cada vez mais importante. Mas como decidir entre OpenClaw, Siri, Google Assistant e Alexa? Cada um tem seu lugar. Vamos comparar.

## Panorama Geral

| Recurso | OpenClaw | Siri | Google Assistant | Alexa |
|---------|----------|------|-----------------|-------|
| **Tipo** | Open Source, Local | Proprietário, Cloud | Proprietário, Cloud | Proprietário, Cloud |
| **Privacidade** | Máxima (local) | Intermediária | Intermediária | Intermediária |
| **Custo** | Grátis + APIs | Incluído | Gratuito | Gratuito |
| **Customização** | Total | Limitada | Limitada | Limitada |
| **Open Source** | Sim | Não | Não | Não |
| **Integração Gmail** | Sim (nativa) | Parcial | Nativa | Não |
| **Integração Calendar** | Sim (nativa) | Nativa | Nativa | Limitada |
| **Funciona Offline** | Sim | Limitado | Não | Não |
| **Auto-extensível** | Sim | Não | Parcial (Actions) | Parcial (Skills) |
| **Memória Persistente** | Sim (24/7) | Sim | Sim | Sim |
| **Plataformas** | macOS, Linux | Apple | Android, Web | Alexa Devices |
| **Curva Aprendizado** | Alta | Baixa | Baixa | Baixa |

## Privacidade: O Grande Diferencial

### OpenClaw
- Dados nunca deixam seu computador
- Criptografia local nativa
- Você controla o que é armazenado
- Sem análise de privacidade por terceiros
- **Risco**: Responsabilidade sua de manter seguro

### Siri
- Sincroniza com Apple servers
- Apple coleta dados de uso
- Melhorou privacidade com on-device processing
- Mas ainda depende de cloud para muitos recursos
- **Risco**: Apple lê suas conversas (teoricamente criptografadas)

### Google Assistant
- Registra todas as interações
- Google usa dados para treinar modelos
- Criptografia em trânsito apenas
- Dados armazenados indefinidamente
- **Risco**: Alto. Google monetiza seus dados

### Alexa
- Amazon registra e armazena conversas
- Usa dados para recomendações
- Humanos podem revisar gravações
- Políticas mudaram, mas preocupações persistem
- **Risco**: Alto. Amazon vende dados a terceiros

**Vencedor em Privacidade**: OpenClaw, disparado.

## Funcionalidades: Quem Faz O Quê

### OpenClaw
- Controla Gmail, Calendar, arquivos
- Integra com APIs customizadas
- Cria skills automaticamente
- Aprende seus padrões
- Ideal para: Desenvolvedores, pessoas tech-savvy, quem quer privacidade máxima

### Siri
- Controla apps Apple nativamente
- Funciona com HomeKit
- Busca web básica
- Funciona offline (limitado)
- Ideal para: Usuários Apple que não ligam com privacidade

### Google Assistant
- Integração profunda com Google Services
- Funciona em múltiplos dispositivos
- Busca web e compras integradas
- Melhor reconhecimento de linguagem
- Ideal para: Usuários Google Workspace, Android, ecossistema Google

### Alexa
- Funciona como hub smart home
- Melhor em dispositivos smart home
- Skills externas (desenvolvedoras de terceiros)
- Compras integradas
- Ideal para: Quem tem muitos dispositivos Alexa

**Vencedor em Features**: Depende do caso de uso. Google Assistant em integração, OpenClaw em customização.

## Customização: Seu Controle

### OpenClaw
Você pode:
- Modificar código-fonte
- Criar skills específicas
- Controlar exatamente o que acontece
- Hospedar em servidor próprio
- Treinar com seus dados

### Siri
Você pode:
- Criar Atalhos (workflows básicos)
- Limitar que dados compartilha
- Nada mais

### Google Assistant
Você pode:
- Criar Rotinas (workflows)
- Controlar dados no Google Takeout
- Treinar com dados seus (beta)
- Nada além disso

### Alexa
Você pode:
- Criar Rotinas
- Habilitar/desabilitar Skills
- Limitar dados compartilhados

**Vencedor em Customização**: OpenClaw, total liberdade.

## Ecossistema: Integração com Serviços

### OpenClaw
- Integra com qualquer API
- Webhooks customizados
- Suporta: Gmail, Calendar, Slack, Discord, GitHub, etc
- Você decide o que integra

### Siri
- Apple Maps, Apple Music, HomeKit
- Alguns serviços terceiros (via Atalhos)
- Limitado em comparação

### Google Assistant
- Gmail, Google Workspace, YouTube, Maps
- Extenso em produtos Google
- Limitado fora do ecossistema Google
- Algumas integrações de terceiros

### Alexa
- Amazon Services, Smart Home devices
- Alexa Skills (marketplace)
- Centenas de integrações
- Mas Alexa é o intermediário

**Vencedor em Ecossistema Aberto**: OpenClaw. Você decide.

## Performance e Latência

### OpenClaw
- Execução local: <100ms respostas
- Sem latência de rede
- Depende do seu hardware
- **Pro**: Rápido quando offline

### Siri
- Latência de rede: 200-500ms
- Processamento local (iOS 17+)
- Geralmente responsivo

### Google Assistant
- Latência de rede: 300-800ms
- Processamento otimizado
- Mais inteligente, mas mais lento

### Alexa
- Latência de rede: 200-600ms
- Wake word processing local
- Razoável para smart home

**Vencedor em Performance**: OpenClaw (local).

## Preço: O Cálculo Real

| Assistente | Custo Base | Custos Ocultos | Total Anual |
|-----------|-----------|----------------|-----------|
| **OpenClaw** | Grátis | APIs (~$5-50) | $60-600 |
| **Siri** | Incluído | Nenhum | $0 |
| **Google Assistant** | Gratuito | Seus dados | Inestimável |
| **Alexa** | Gratuito | Seus dados | Inestimável |

OpenClaw é tecnicamente pago, mas o preço é transparente. Google e Alexa são "gratuitos" porque você é o produto.

## Matriz de Decisão

### Escolha OpenClaw se:
- Privacidade é sua prioridade #1
- Você é técnico ou quer aprender
- Quer customizar totalmente
- Não quer vender seus dados

### Escolha Siri se:
- Usa só Apple
- Quer algo que funciona sem pensar
- Privacidade é secundária
- Já paga Apple anyway

### Escolha Google Assistant se:
- Usa Google Workspace
- Quer melhor processamento de linguagem
- Não liga com privacidade
- Quer máxima integração Google

### Escolha Alexa se:
- Tem smart home devices
- Usa Echo devices
- Quer assistente hands-free
- Não liga com Amazon coletar dados

## Conclusão

Não existe "melhor assistente". Existe o certo para cada situação.

**Se privacidade importa**: OpenClaw é imbatível. Custe mais tempo, vale.

**Se você é Apple-only**: Siri é integrado e suficiente.

**Se você vive no Google**: Google Assistant é mais smart.

**Se você tem smart home**: Alexa é a escolha natural.

Mas se eu tivesse que apostar no futuro? OpenClaw representa uma mudança necessária no como pensamos sobre dados pessoais. Assistentes abertos, descentralizados, genuinamente seus.

## O que Fazer Agora

1. **Defina suas prioridades**: Privacidade vs conveniência? Customização vs simplicidade?
2. **Teste OpenClaw** se privacidade é importante para você
3. **Aproveite o ecosistema atual** (Siri, Google, Alexa) enquanto experimentas OpenClaw em paralelo
',
  'analysis',
  ARRAY['openclaw', 'siri', 'google-assistant', 'alexa', 'assistentes-ia', 'comparativo'],
  true,
  true
);

INSERT INTO public.contents (title, description, body, category, tags, featured, published)
VALUES (
  'Por Que OpenClaw Mudou Minha Produtividade (e Pode Mudar a Sua)',
  'Experiência pessoal usando OpenClaw: primeiras impressões, casos de uso reais, impacto na rotina',
  '
# Por Que OpenClaw Mudou Minha Produtividade (e Pode Mudar a Sua)

Há 3 meses comecei a usar OpenClaw seriamente. O resultado? Mudou como gerencio meu trabalho. Não dramaticamente, mas de forma sustentável. Quero compartilhar o que aprender.

## As Primeiras 48 Horas: Frição

Instalar OpenClaw não é tão simples como abrir Siri.

- Clone repositório
- Configure Python
- Configure tokens de API
- Escolha canal (WhatsApp, Telegram, Discord)
- Teste integração

Levou 2 horas. Se você não é técnico, vai bater cabeça.

Mas uma vez rodando? Mágico.

Conectei via Telegram. Abri chat com meu assistente local. Comecei a conversar naturalmente.

## Caso de Uso 1: Gerenciamento de Emails

O primeiro grande ganho foi emails.

**Antes**: Abria Gmail 5-10 vezes por dia. Verificava. Respondia. Esquecia dos importantes.

**Agora**: Pergunto ao OpenClaw:
- "Resumo meus emails importantes"
- "Responda a emails sobre fatura automaticamente"
- "Lembre-me dos emails sem resposta"

O assistente lê meu Gmail (com permissão explícita, dados localmente), resume, sugere ações.

Economia de tempo: ~15 minutos por dia.

Parece pouco, mas em 21 dias trabalhados = 5 horas. Em um ano = 60 horas.

## Caso de Uso 2: Agendamento de Reuniões

Antes coordenar reuniões era loucura:

1. Pessoa X me propõe horário
2. Eu entro em Google Calendar
3. Verifico disponibilidade
4. Negoceio alternativas
5. Confirmo por email

Agora:

**Eu**: "OpenClaw, X quer reunião próxima terça. Vê minha disponibilidade"

**OpenClaw**: "Você está livre 14:00-16:00 terça e 10:00-12:00 quarta"

**Eu**: "Confirma 14:00 terça com X"

**OpenClaw**: (envia email automático, atualiza calendar)

Pronto. Menos 10 minutos por reunião. E deixa elas acontecerem.

## Caso de Uso 3: Memória Pessoal

Este é o diferencial sutil mas poderoso.

OpenClaw rodam 24/7 e aprende seus padrões:

- Horário que você acorda
- Projetos que trabalha
- Pessoas importantes
- Padrões de sono
- Preferências de refeição

Semana 3, OpenClaw começou a:
- Sugerir "você não dormiu bem ontem, quer desacelerar hoje?"
- Lembrar aniversários de contactos importantes
- Sugerir fazer ginástica quando notava falta de movimento
- Resumir por segmento de tempo

Isso é IA genuinamente útil. Não é "aqui está sua previsão do tempo", é "aqui está sua vida organizada".

## Caso de Uso 4: Automação de Tarefas Repetitivas

Comecei listando tarefas manuais que faz frequentemente:

- Copiar links de artigos para Notion
- Organizar screenshots em pastas
- Atualizar planilha de despesas
- Sincronizar dados entre apps

Criei "skills" no OpenClaw para cada uma. Agora:

"OpenClaw, adicione este artigo à minha reading list"

E pronto. Ele faz tudo: pega link, adiciona a Notion, categoriza, adiciona a memoria.

## Caso de Uso 5: Brainstorming e Ideação

Aqui tem uma curva interessante.

OpenClaw tem memória de tudo que você já conversou. Então pode:
- Referir conversas antigas
- Conectar ideias
- Sugerir padrões que você não viu

Quando trabalho em projeto novo, digo:

"OpenClaw, baseado em meus projetos passados, qual arquitetura você sugeriria?"

Ele refere 3 projetos anteriores, sugere padrão que funcionou bem.

Não é perfeito, mas é input valioso que economiza tempo de design.

## O que NÃO Funciona Bem

Ser honesto: há frações onde OpenClaw ainda falha.

### Compreensão de Contexto Complexo

Conversa:
**Eu**: "Preciso decidir entre arquitetura A e B"
**OpenClaw**: [Explica diferenças técnicas]
**Eu**: "Mas no meu caso específico..."
**OpenClaw**: [Não entende nuance]

Para decisões complexas, ainda preciso pensar sozinho.

### Execução de Tarefas Interdependentes

Se tarefa X depende de resultado de Y, e Y falha silenciosamente, OpenClaw continua com Y marcada como sucesso.

Precisa de monitoramento.

### Integração Com Apps Não-Suportados

Se seu app favorito não tem API, OpenClaw não integra.

Criei workaround com scripts customizados, mas não é native.

### Latência Ocasional

Às vezes, respostas demoram 3-5 segundos. Não é lento, mas rompe fluxo.

Ocorre quando processamento local é intenso.

## Transformação Verdadeira: Mudança Mental

O ganho maior não é tempo economizado. É mental.

**Antes**: Tinha 47 tabs abertos, 3 notepads, 2 planilhas, email sempre aberto.

Contexto task-switching permanente. Sempre esquecia algo.

**Agora**: Uma conversa. Um assistente. Uma fonte de verdade.

Perdi a sensação de estar deixando cair bolas. OpenClaw é minha externalização de memória.

Isso libera espaço mental para trabalho criativo real.

## Impacto Mensurável

Alguns números após 3 meses:

- **Emails**: 20 minutos economizados/semana
- **Agendamento**: 2 horas economizadas/mês
- **Tarefas repetitivas**: 5 horas/mês
- **Redução de contexto-switching**: Imensa (não mensurável)
- **Satisfação geral**: 40% aumento

Total direto: ~10 horas/mês.

Total indireto (melhor foco): Imuro, mas provavelmente > 20 horas/mês.

## Desvantagens Práticas

### 1. Servidor Sempre Ligado

OpenClaw roda localmente, então precisa de computador ou servidor sempre ligado.

Solução: Servidor barato (~$5/mês).

### 2. Curva de Aprendizado

Leva tempo para:
- Pensar em assistente como interface
- Craftar boas prompts
- Criar skills que realmente ajudam

Investimento: 5-10 horas de setup.

### 3. Responsabilidade

Com Google Assistant, se falha, é culpa deles.

Com OpenClaw, é culpa sua. Você é responsável por segurança, backup, uptime.

Mas isso é também liberdade.

## Recomendação

**Deveria você usar OpenClaw?**

Se você:
- É técnico (ou disposto a aprender)
- Se preocupa com privacidade
- Quer customizar completamente
- Está disposto a investir 10h de setup

**Então sim, definitivamente tente.**

Se você:
- Quer algo que funciona em 5 minutos
- Aceita privacidade como tradeoff
- Quer suporte oficial

Então Siri/Google Assistant são mais práticos hoje.

Mas meu palpite? Nos próximos 2 anos, OpenClaw vai ganhar tração entre desenvolvedores e early adopters. Daí escala.

## O Que Mudou Mesmo

A maior mudança foi psicológica.

Depois de ter um assistente que genuinamente sabe minhas preferências, que roda localmente, que é extensível infinitamente...

Volta a Siri é como voltar a um livro depois de ebook. Tecnicamente funciona, mas você não quer.

## O que Fazer Agora

1. **Se é desenvolvedor**: Clone OpenClaw do GitHub e faça setup local. Teste por 2 semanas
2. **Se quer eficiência**: Comece com caso de uso específico (email ou agendamento) e expanda
3. **Se se importa com privacidade**: OpenClaw é seu candidato principal. Invista as 10 horas de setup
4. **Se é indeciso**: Usa Siri por enquanto, mas mantenha OpenClaw no radar
',
  'thought',
  ARRAY['openclaw', 'produtividade', 'experiência-pessoal', 'assistentes-ia', 'opinião'],
  true,
  true
);

