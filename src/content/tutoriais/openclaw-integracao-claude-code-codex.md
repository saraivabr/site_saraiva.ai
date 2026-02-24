---
title: "OpenClaw + Claude Code: Integração para Desenvolvimento"
slug: "openclaw-integracao-claude-code-codex"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Aprenda a integrar OpenClaw com Claude Code e Codex CLI para automação de desenvolvimento, PRs, code review e gestão de projetos via chat."
tags: ["openclaw", "claude-code", "codex", "desenvolvimento", "automação", "ci-cd"]
difficulty: "avancado"
duration: "50 min"
---

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
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

class ClaudeCodeExecutor {
  constructor(config = {}) {
    this.name = 'claude-code-executor';
    this.config = config;
  }

  /**
   * Gera código usando Claude Code
   */
  async gerar_funcao(params) {
    const { descricao, linguagem = 'javascript', contexto = '' } = params;

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
    const { codigo, erro, arquivo = 'desconhecido.js' } = params;

    try {
      const prompt = `
        Arquivo: ${arquivo}
        
        Erro: ${erro}
        
        Código problemático:
        \`\`\`
        ${codigo}
        \`\`\`
        
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
    const { codigo, arquivo, diretriz = 'melhorar legibilidade' } = params;

    try {
      const prompt = `
        Arquivo: ${arquivo}
        
        Refatore este código para: ${diretriz}
        
        Código atual:
        \`\`\`
        ${codigo}
        \`\`\`
        
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
        
        \`\`\`javascript
        ${codigo}
        \`\`\`
        
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
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);
const fs = require('fs').promises;
const path = require('path');

class CodexAutomacao {
  constructor(config = {}) {
    this.name = 'codex-automacao';
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
        comando += ` --files ${arquivos.join(',')}`;
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
    const { tipo = 'unit', cobertura = true } = params;

    try {
      let comando = `npm test -- --testPathPattern="${tipo}"`;
      
      if (cobertura) {
        comando += ' --coverage';
      }

      const { stdout, stderr } = await execPromise(comando, {
        cwd: this.projectPath
      });

      // Parse do output de testes
      const passou = !stdout.includes('FAIL');
      
      return {
        sucesso: true,
        passou,
        output: stdout,
        erros: stderr || '',
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
      tipo = 'coder',
      prioridade = 'normal' 
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
    const { arquivo, tipo = 'qualidade' } = params;

    try {
      const conteudo = await fs.readFile(
        path.join(this.projectPath, arquivo),
        'utf-8'
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
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

class GitHubPRAutomation {
  constructor(config = {}) {
    this.name = 'github-pr-automation';
    this.config = config;
    this.repo = config.repo || '';
  }

  /**
   * Cria PR automaticamente
   */
  async criar_pr(params) {
    const {
      titulo,
      descricao,
      branch,
      base = 'main',
      labels = [],
      reviewers = []
    } = params;

    try {
      // Criar branch se não existir
      await execPromise(`git checkout -b ${branch}`);

      // Fazer commit de mudanças
      await execPromise('git add .');
      await execPromise(`git commit -m "${titulo}"`);
      
      // Push
      await execPromise(`git push origin ${branch}`);

      // Criar PR com gh CLI
      let comando = `gh pr create --title "${titulo}" --body "${descricao}" --base ${base} --head ${branch}`;
      
      if (labels.length > 0) {
        comando += ` --label "${labels.join(',')}"`;
      }

      if (reviewers.length > 0) {
        comando += ` --reviewer "${reviewers.join(',')}"`;
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
    const { pr_number, evento = 'APPROVE' } = params;

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
    const { pr_number, estrategia = 'squash' } = params;

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
const ClaudeCodeExecutor = require('../skills/claude-code-executor');
const CodexAutomacao = require('../skills/codex-automacao');
const GitHubPRAutomation = require('../skills/github-pr-automation');

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
      console.log('🔍 Passo 1: Detectar testes falhando...');
      const testesResult = await this.codex.rodar_testes({
        tipo: 'unit',
        cobertura: false
      });

      if (testesResult.passou) {
        return {
          sucesso: true,
          mensagem: '✅ Todos os testes passando!',
          nenhuma_acao_necessaria: true
        };
      }

      console.log('❌ Testes falhando. Analisando erros...');
      
      // Armazenar na memória para referência futura
      await this.memory.set('ultimo-teste-falha', {
        output: testesResult.output,
        timestamp: new Date().toISOString()
      });

      console.log('🤖 Passo 2: Usar Claude Code para corrigir...');
      
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

      console.log('📝 Passo 3: Criar branch e commit...');
      
      const branch = `fix/tests-${Date.now()}`;
      
      // Aqui você aplicaria a correção ao arquivo
      // (implementação simplificada)
      
      console.log('🔁 Passo 4: Verificar se corrigiu...');
      
      const testesNovoResult = await this.codex.rodar_testes({});
      
      if (!testesNovoResult.passou) {
        return {
          sucesso: false,
          mensagem: '❌ Correção não funcionou',
          detalhes: testesNovoResult
        };
      }

      console.log('🎉 Passo 5: Criar PR com a correção...');
      
      const pr = await this.github.criar_pr({
        titulo: 'Fix: Corrigir testes falhando',
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
        labels: ['automated', 'tests', 'fix'],
        reviewers: params.reviewers || []
      });

      if (pr.sucesso) {
        console.log('✨ PR criado com sucesso!');
        
        await this.memory.set('ultimo-pr-correcao', {
          pr_url: pr.pr_url,
          branch: branch,
          timestamp: new Date().toISOString()
        });
      }

      return {
        sucesso: true,
        mensagem: '✅ Workflow completado com sucesso!',
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
    const match = output.match(/●\s+(.+?)\s+/);
    return match ? match[1] : 'test.js';
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
const TelegramBot = require('node-telegram-bot-api');
const FixTestsWorkflow = require('../workflows/fix-tests');

class OpenClawTelegramBot {
  constructor(token, config) {
    this.bot = new TelegramBot(token, { polling: true });
    this.workflow = new FixTestsWorkflow(config);
    this.setupHandlers();
  }

  setupHandlers() {
    this.bot.on('message', async (msg) => {
      const texto = msg.text.toLowerCase();

      if (texto.includes('fix tests')) {
        const resultado = await this.workflow.executar();
        
        const resposta = resultado.sucesso 
          ? `✅ ${resultado.mensagem}\n\nPR: ${resultado.etapas.pr_url}`
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
