---
title: "OpenClaw Heartbeats: Automação Proativa e Agendamento"
slug: "openclaw-heartbeats-tarefas-proativas"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Configure Heartbeats para automação proativa: agendamentos, check-ins automáticos, morning briefings e monitoramento contínuo com seu assistente de IA pessoal."
tags: ["openclaw", "heartbeats", "automação", "agendamento", "cron", "ia-proativa"]
difficulty: "avancado"
duration: "50 min"
---

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
const axios = require('axios');

class MorningBriefing {
  constructor(openclaw, config = {}) {
    this.openclaw = openclaw;
    this.config = config;
    this.name = 'morning-briefing';
  }

  async execute() {
    console.log('📰 Preparando Morning Briefing...');

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
        namespace: 'briefings',
        key: `morning-${new Date().toISOString().split('T')[0]}`,
        value: briefing
      });

      // Notificar
      await this.notificar(briefing);

      return {
        sucesso: true,
        briefing
      };

    } catch (erro) {
      console.error('Erro no Morning Briefing:', erro);
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
        titulo: 'Revisar PR #123',
        prioridade: 'alta',
        deadline: '14:00'
      },
      {
        titulo: 'Call com cliente',
        prioridade: 'alta',
        deadline: '15:00'
      }
    ];
  }

  async buscarNoticiasPersonalizadas() {
    // Buscar notícias de interesse
    const interesses = ['tecnologia', 'IA', 'startup'];

    const noticias = [];
    for (const tema of interesses) {
      const response = await axios.get(
        `https://newsapi.org/v2/everything`,
        {
          params: {
            q: tema,
            sortBy: 'publishedAt',
            language: 'pt',
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
      namespace: 'projetos',
      query: 'em-andamento',
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
      namespace: 'lembretes',
      query: new Date().toISOString().split('T')[0],
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
    return 'Ensolarado';
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
        titulo: '📰 Morning Briefing',
        corpo: mensagem,
        prioridade: 'high'
      });

      // Email
      if (this.config.incluir_email) {
        await this.enviarEmail({
          assunto: '📰 Seu Morning Briefing',
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
      .join('');
  }

  renderizarNoticias(noticias) {
    return noticias
      .map(n => `<p><strong>${n.tema}</strong>: ${n.items[0].title}</p>`)
      .join('');
  }
}

module.exports = MorningBriefing;
```

### 2. Health Check (Monitoramento)

```javascript
// heartbeats/health-check.js
const axios = require('axios');

class HealthCheck {
  constructor(openclaw, config = {}) {
    this.openclaw = openclaw;
    this.config = config;
    this.alertas_consecutivos = {};
  }

  async execute() {
    console.log('🏥 Executando Health Check...');

    const servicos = [
      {
        nome: 'API Principal',
        url: 'https://api.meuprojeto.com/health',
        critico: true
      },
      {
        nome: 'Database',
        url: 'https://api.meuprojeto.com/db/health',
        critico: true
      },
      {
        nome: 'Cache Redis',
        url: 'https://api.meuprojeto.com/redis/health',
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
      namespace: 'health-checks',
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
        tempo_resposta: response.headers['x-response-time'],
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
      titulo: '🚨 Health Check Alert',
      mensagem: `${servico.nome} está offline (${status.erro})`,
      prioridade: servico.critico ? 'critical' : 'warning'
    });

    // Armazenar alerta
    await this.openclaw.memory.store({
      namespace: 'alertas',
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
const fs = require('fs').promises;
const path = require('path');

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
    console.log('🧹 Iniciando limpeza automática...');

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
      namespace: 'limpezas',
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
      older_than: '90 days'
    });

    let removidas = 0;
    for (const item of items) {
      await this.openclaw.memory.delete(item.id);
      removidas++;
    }

    return `${removidas} memórias antigas removidas`;
  }

  async limparLogs() {
    const logDir = path.join(process.env.HOME, '.openclaw/logs');
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
    if (!this.config.limpar_temporarios) return 'Ignorado';

    const tmpDir = path.join(process.env.HOME, '.openclaw/tmp');

    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
      return 'Pasta temporária limpa';
    } catch {
      return 'Sem arquivos temporários';
    }
  }

  async comprimir_dados() {
    // Comprimir dados antigos
    return 'Dados comprimidos';
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
    console.log('📊 Monitorando sistema...');

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
      namespace: 'metricas-sistema',
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
    const os = require('os');
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
    const os = require('os');
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    return Math.round((usedMemory / totalMemory) * 100);
  }

  async verificarDisco() {
    // Usar 'df' command ou similar
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
      prioridade: 'warning'
    });
  }
}

module.exports = MonitorContinuo;
```

## Registrar Heartbeats Customizados

```javascript
// Adicionar um heartbeat customizado
await openclaw.registerHeartbeat({
  id: 'meu-heartbeat',
  nome: 'Meu Heartbeat',
  cron: '0 * * * *', // A cada hora
  handler: async (openclaw, config) => {
    console.log('Executando meu heartbeat...');
    
    // Sua lógica aqui
    const resultado = await fazerAlgo();

    // Armazenar resultado
    await openclaw.memory.store({
      namespace: 'heartbeats',
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
await openclaw.config.set('notificacoes', {
  canais: {
    push: {
      enabled: true,
      servico: 'firebase'
    },
    email: {
      enabled: true,
      servico: 'sendgrid'
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
    critico: ['push', 'email', 'slack'],
    warning: ['push', 'email'],
    info: ['push']
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
