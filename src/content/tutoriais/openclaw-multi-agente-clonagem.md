---
title: "OpenClaw Multi-Agente: Clonagem e Escalação"
slug: "openclaw-multi-agente-clonagem"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Aprenda a clonar e executar múltiplas instâncias do OpenClaw para família, empresa ou casos de uso específicos com orquestração centralizada."
tags: ["openclaw", "multi-agente", "escalação", "clonagem", "coordenação", "swarm"]
difficulty: "avancado"
duration: "60 min"
---

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
openclaw clone create \
  --template empresa \
  --nome "OpenClaw Empresa" \
  --skills github,slack,jira \
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
version: '3.8'

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
const EventEmitter = require('events');

/**
 * Coordenador central que gerencia múltiplos OpenClaws
 */
class HiveCoordinator extends EventEmitter {
  constructor(config = {}) {
    super();
    this.name = 'HiveCoordinator';
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
      status: 'ativo',
      tarefas: 0,
      ultima_atividade: Date.now()
    });

    console.log(`✅ Agente ${id} registrado na Hive`);

    this.emit('agente-registrado', { id });
  }

  /**
   * Distribuir tarefa entre agentes
   */
  async distribuirTarefa(tarefa) {
    console.log(`📤 Distribuindo tarefa: ${tarefa.id}`);

    const agente = this.selecionarAgente(tarefa);

    if (!agente) {
      throw new Error('Nenhum agente disponível');
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
    if (this.config.estrategia === 'round-robin') {
      const agentes_ativos = Array.from(this.agentes.values())
        .filter(a => a.status === 'ativo');
      
      return agentes_ativos[0];
    }

    // Estratégia 2: Menos carga
    if (this.config.estrategia === 'menos-carga') {
      return Array.from(this.agentes.values())
        .filter(a => a.status === 'ativo')
        .sort((a, b) => a.tarefas - b.tarefas)[0];
    }

    // Estratégia 3: Especialista
    if (this.config.estrategia === 'especialista') {
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
      compartilhado_por: 'hive'
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
  async executarDistribuido(tarefas, estrategia = 'paralelo') {
    console.log(`🔄 Executando ${tarefas.length} tarefas em modo ${estrategia}`);

    if (estrategia === 'paralelo') {
      // Todos ao mesmo tempo
      const promessas = tarefas.map(t => this.distribuirTarefa(t));
      return Promise.all(promessas);
    }

    if (estrategia === 'sequencial') {
      // Um por um
      const resultados = [];
      for (const tarefa of tarefas) {
        const resultado = await this.distribuirTarefa(tarefa);
        resultados.push(resultado);
      }
      return resultados;
    }

    if (estrategia === 'pipeline') {
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
    if (this.config.resolver_por === 'votacao') {
      const votos = {};

      for (const [id, agente] of this.agentes) {
        const voto = await agente.agente.votar(conflito);
        votos[id] = voto;
      }

      const vencedor = Object.keys(votos).reduce((a, b) =>
        votos[a] > votos[b] ? a : b
      );

      return {
        resolvido_por: 'votacao',
        vencedor,
        resultado: votos[vencedor]
      };
    }

    // Estratégia 2: Especialista
    if (this.config.resolver_por === 'especialista') {
      const especialista = Array.from(this.agentes.values())
        .find(a => a.agente.especialidades?.includes(conflito.tipo));

      return {
        resolvido_por: 'especialista',
        especialista: especialista.id,
        resultado: await especialista.agente.resolver(conflito)
      };
    }
  }

  /**
   * Monitorar saúde dos agentes
   */
  async monitorarAgentes() {
    console.log('🏥 Monitorando saúde da Hive...');

    const relatorio = {
      total_agentes: this.agentes.size,
      agentes_ativos: 0,
      agentes_inativos: 0,
      detalhes: []
    };

    for (const [id, agente] of this.agentes) {
      const saude = await agente.agente.verificarSaude();

      if (saude.status === 'ativo') {
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
  tipo: 'familia',
  estrategia: 'menos-carga'
});

// Criar instâncias para cada pessoa
await coordinador.registrarAgente('pai', new OpenClaw({
  nome: 'OpenClaw Papai',
  contexto: 'Gerenciar finanças familiares e projetos'
}));

await coordinador.registrarAgente('mae', new OpenClaw({
  nome: 'OpenClaw Mamãe',
  contexto: 'Organizar casa, compras, agenda'
}));

await coordinador.registrarAgente('filho', new OpenClaw({
  nome: 'OpenClaw Filho',
  contexto: 'Ajudar com estudos'
}));

// Compartilhar agenda familiar
await coordinador.compartilharMemoria('agenda-familiar', {
  eventos: [
    { data: '2026-03-01', evento: 'Aniversário avó' },
    { data: '2026-03-15', evento: 'Reunião de pais' }
  ]
});

// Distribuir tarefa: "Planejar férias"
const resultado = await coordinador.distribuirTarefa({
  id: 'plan-ferias',
  tipo: 'planejamento',
  descricao: 'Planejar férias em julho'
});
```

### 2. Empresa

```javascript
const hive = new HiveCoordinator({
  tipo: 'empresa',
  estrategia: 'especialista',
  resolver_por: 'votacao'
});

// Diferentes departamentos
await hive.registrarAgente('dev-lead', new OpenClaw({
  especialidades: ['desenvolvimento', 'arquitetura'],
  skills: ['github', 'code-review']
}));

await hive.registrarAgente('devops', new OpenClaw({
  especialidades: ['infraestrutura', 'deployment'],
  skills: ['docker', 'kubernetes', 'monitoring']
}));

await hive.registrarAgente('product', new OpenClaw({
  especialidades: ['produto', 'roadmap'],
  skills: ['jira', 'analytics']
}));

await hive.registrarAgente('sales', new OpenClaw({
  especialidades: ['vendas', 'clientes'],
  skills: ['salesforce', 'email']
}));

// Tarefas departamentais
await hive.executarDistribuido([
  { id: 't1', tipo: 'desenvolvimento', descricao: 'Code review PR #123' },
  { id: 't2', tipo: 'deployment', descricao: 'Deploy para produção' },
  { id: 't3', tipo: 'produto', descricao: 'Atualizar roadmap' }
], 'paralelo');

// Monitorar saúde
const relatorio = await hive.monitorarAgentes();
console.log(relatorio);
```

### 3. Agência/Freelancer

```javascript
// Um OpenClaw para cada cliente
const clientes = ['cliente-a', 'cliente-b', 'cliente-c'];

const hive = new HiveCoordinator({
  tipo: 'agencia',
  estrategia: 'round-robin'
});

for (const cliente of clientes) {
  await hive.registrarAgente(cliente, new OpenClaw({
    nome: `OpenClaw ${cliente}`,
    contexto: `Assistente dedicado para ${cliente}`
  }));
}

// Distribuir demandas
const demandas = [
  { id: 'dem-1', cliente: 'cliente-a', descricao: 'Desenvolver feature X' },
  { id: 'dem-2', cliente: 'cliente-b', descricao: 'Bug fixing' },
  { id: 'dem-3', cliente: 'cliente-c', descricao: 'Consultoria arquitetura' }
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
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: '~/.openclaw/logs/all-instances.log'
    }),
    new winston.transports.File({
      filename: '~/.openclaw/logs/errors.log',
      level: 'error'
    })
  ]
});

// Cada instância loga para arquivo centralizado
class OpenClawComLog {
  log(agente_id, mensagem, nivel = 'info') {
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
