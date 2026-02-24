---
title: "Como Instalar OpenClaw no Mac e Linux"
slug: "como-instalar-openclaw-mac-linux"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Tutorial detalhado de instalação do OpenClaw em Mac (Intel e M1/M2/M3) e Linux com verificação de funcionamento."
tags: ["openclaw", "instalação", "mac", "linux", "tutorial"]
image: ""
source: ""
featured: false
difficulty: "iniciante"
duration: "20 min"
---

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
