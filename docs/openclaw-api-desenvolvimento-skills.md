# Desenvolvimento de Skills OpenClaw - Guia Técnico

Aprenda a criar, debugar, publicar e manter skills profissionais para OpenClaw. Inclui arquitetura, API, hooks, best practices e publicação.

---

## 🏗️ Arquitetura de Skills

### Modelo de Execução
```
┌─────────────────────────────────────────────────────────┐
│                  OpenClaw Runtime                        │
├─────────────────────────────────────────────────────────┤
│  Input (Comando/Evento) →  Skill Handler → Output       │
│                              ↓                           │
│                         (Processamento)                  │
│                              ↓                           │
│                    (Integração de Dados)                 │
│                              ↓                           │
│                         (Return Result)                  │
└─────────────────────────────────────────────────────────┘
```

### Ciclo de Vida de Skill
```
1. Registro → 2. Inicialização → 3. Execução → 4. Limpeza
   ↓             ↓                ↓             ↓
 manifest    setup()            handler()    cleanup()
```

---

## 📋 Estrutura de Projeto

### Layout Recomendado
```
my-skill/
├── manifest.json              # Metadados da skill
├── package.json               # Dependências Node
├── src/
│   ├── index.js              # Ponto de entrada
│   ├── handlers/             # Lógica de negócio
│   │   ├── command.js
│   │   ├── event.js
│   │   └── schedule.js
│   ├── integrations/         # Conectores externos
│   │   ├── api-client.js
│   │   └── db-manager.js
│   ├── utils/                # Funções auxiliares
│   │   ├── validators.js
│   │   └── formatters.js
│   └── config/               # Configurações
│       └── constants.js
├── tests/
│   ├── handlers.test.js
│   ├── integration.test.js
│   └── mocks/
├── docs/
│   ├── API.md               # Documentação API
│   ├── EXAMPLES.md          # Casos de uso
│   └── TROUBLESHOOTING.md
├── examples/
│   └── usage-example.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── README.md
└── CHANGELOG.md
```

---

## 🔧 Manifest.json Detalhado

```json
{
  "name": "task-automation",
  "version": "2.1.0",
  "displayName": "Task Automation Pro",
  "description": "Automação avançada de tarefas com IA",
  "author": "seu-nome",
  "license": "MIT",
  "homepage": "https://github.com/seu-nome/task-automation",
  "repository": {
    "type": "git",
    "url": "https://github.com/seu-nome/task-automation.git"
  },
  "main": "src/index.js",
  "keywords": ["tasks", "automation", "productivity", "ai"],
  
  "openclaw": {
    "minVersion": "1.2.0",
    "maxVersion": "2.x",
    
    "permissions": [
      "read:tasks",
      "write:tasks",
      "read:calendar",
      "read:email"
    ],
    
    "triggers": [
      "on:command",
      "on:schedule",
      "on:event:task-created",
      "on:event:task-updated"
    ],
    
    "hooks": [
      {
        "name": "pre-execute",
        "description": "Validação antes de executar"
      },
      {
        "name": "post-execute",
        "description": "Processamento após execução"
      }
    ],
    
    "settings": {
      "max_tasks_per_batch": {
        "type": "number",
        "default": 50,
        "description": "Máximo de tarefas por lote"
      },
      "enable_ai_suggestions": {
        "type": "boolean",
        "default": true,
        "description": "Ativar sugestões de IA"
      },
      "notification_level": {
        "type": "string",
        "enum": ["silent", "normal", "verbose"],
        "default": "normal"
      }
    },
    
    "integrations": {
      "required": ["openclaw-core"],
      "optional": ["slack", "github", "google-drive"]
    }
  }
}
```

---

## 💻 API do OpenClaw

### Context Object
```javascript
// Disponível em todos os handlers
const handler = async (input, context) => {
  const {
    // Informações do usuário
    userId,
    userName,
    userEmail,
    
    // Informações da skill
    skillName,
    skillVersion,
    
    // Utilitários
    logger,
    cache,
    secrets,
    storage,
    
    // APIs OpenClaw
    openclaw: {
      tasks: { list, create, update, delete },
      calendar: { getEvents, createEvent },
      email: { send, receive },
      integration: { call }
    }
  } = context;
};
```

### Logger API
```javascript
// Estruturado e levado automaticamente para observabilidade
context.logger.info('Tarefa criada', { taskId: '123', userId });
context.logger.warn('Taxa de limite próxima', { requests: 95, limit: 100 });
context.logger.error('Falha na integração', { error, details: {} });
context.logger.debug('Estado intermediário', { step: 2, data: {} });

// Com métricas
context.logger.metric('tasks_created', 5);
context.logger.metric('api_latency_ms', 234);
```

### Cache API
```javascript
// TTL baseado em memória
const cached = await context.cache.get('key');
await context.cache.set('key', value, { ttl: 3600 }); // 1 hora
await context.cache.delete('key');
await context.cache.clear(); // Limpar tudo

// Com chave composta
const key = context.cache.key(userId, 'tasks', filterId);
await context.cache.set(key, tasks);
```

### Secrets API (Variáveis de Ambiente)
```javascript
// Seguros - nunca logam valor
const apiKey = context.secrets.get('API_KEY');
const dbPassword = context.secrets.get('DB_PASSWORD');

// Usar em chamadas de API
const headers = {
  'Authorization': `Bearer ${context.secrets.get('TOKEN')}`
};
```

### Storage API (Persistência)
```javascript
// Dados persistem entre execuções
const userData = await context.storage.get('user-prefs', userId);

await context.storage.set('user-prefs', userId, {
  theme: 'dark',
  notifications: true,
  language: 'pt-BR'
});

// Busca com padrão
const allUserPrefs = await context.storage.find('user-prefs');
const activeUsers = await context.storage.find('user-prefs', {
  notifications: true
});
```

### OpenClaw Integration API
```javascript
// Chamar APIs integradas
const tasks = await context.openclaw.tasks.list({
  userId: context.userId,
  status: 'pending',
  limit: 50
});

const event = await context.openclaw.calendar.createEvent({
  title: 'Nova Reunião',
  start: new Date(),
  duration: 60,
  attendees: ['email@example.com']
});

const sent = await context.openclaw.email.send({
  to: recipient,
  subject: 'Relatório Automático',
  template: 'report',
  variables: { userName, date }
});

// Chamar APIs externas via integration
const response = await context.openclaw.integration.call('slack', {
  method: 'chat.postMessage',
  channel: '#notifications',
  text: 'Mensagem automatizada'
});
```

---

## 🎯 Tipos de Handlers

### 1. Command Handler
```javascript
// Invocado por comando do usuário: "openclaw task-automation create ..."
exports.handlers = {
  async createTask(input, context) {
    const {
      title = '',
      priority = 'medium',
      dueDate = null,
      ...options
    } = input;
    
    if (!title) {
      throw new Error('Título é obrigatório');
    }
    
    const task = await context.openclaw.tasks.create({
      title,
      priority,
      dueDate,
      ...options,
      createdBy: context.skillName
    });
    
    context.logger.info('Task created', { taskId: task.id });
    
    return {
      success: true,
      taskId: task.id,
      message: `Tarefa "${title}" criada com sucesso`
    };
  }
};
```

### 2. Event Handler
```javascript
// Invocado por evento do sistema
exports.triggers = {
  async 'on:event:task-created'(event, context) {
    const { taskId, title, userId } = event;
    
    // Analisar tarefa e fazer sugestões
    const suggestions = await analyzeTasks(context);
    
    if (suggestions.length > 0) {
      await context.openclaw.email.send({
        to: userId,
        subject: '💡 Sugestões para sua tarefa',
        template: 'suggestions',
        variables: { title, suggestions }
      });
    }
  }
};
```

### 3. Schedule Handler
```javascript
// Invocado periodicamente
exports.triggers = {
  async 'on:schedule:daily-09:00'(context) {
    context.logger.info('Iniciando processamento diário');
    
    // Buscar tarefas atrasadas
    const overdue = await context.openclaw.tasks.list({
      status: 'pending',
      dueDate: { $lt: new Date() }
    });
    
    // Enviar resumo
    await context.openclaw.email.send({
      to: context.userEmail,
      subject: `📋 ${overdue.length} tarefas atrasadas`,
      template: 'overdue-summary',
      variables: { tasks: overdue }
    });
  }
};
```

### 4. Middleware/Hook Handler
```javascript
// Executar antes/depois de operações
exports.hooks = {
  'pre:openclaw.tasks.create': async (input, context) => {
    // Validação
    if (!input.title || input.title.length < 3) {
      throw new Error('Título deve ter no mínimo 3 caracteres');
    }
    
    // Transformação
    input.title = input.title.trim();
    input.priority = input.priority.toLowerCase();
    
    return input;
  },
  
  'post:openclaw.tasks.create': async (result, context) => {
    // Logging e notificação
    context.logger.info('Task created via hook', {
      taskId: result.id,
      timestamp: new Date()
    });
    
    return result;
  }
};
```

---

## 🐛 Debugging de Skills

### Setup de Desenvolvimento
```bash
# Instalar CLI de desenvolvimento
npm install -g @openclaw/dev-cli

# Iniciar modo desenvolvimento
openclaw-dev watch src/

# Abrir debugger
openclaw-dev debug --port 9229
```

### Logging Estratégico
```javascript
const handler = async (input, context) => {
  context.logger.debug('Entrada recebida', {
    input,
    timestamp: new Date().toISOString(),
    userId: context.userId
  });
  
  try {
    const result = await processInput(input);
    
    context.logger.info('Processamento bem-sucedido', {
      resultId: result.id,
      processingTime: Date.now() - startTime
    });
    
    return result;
  } catch (error) {
    context.logger.error('Erro no processamento', {
      errorMessage: error.message,
      errorCode: error.code,
      stack: error.stack,
      input // Contexto útil
    });
    
    throw error;
  }
};
```

### Testes Unitários
```javascript
// tests/handlers.test.js
const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const { createTaskTask } = require('../src/handlers/command');

describe('Task Handler', () => {
  let mockContext;
  
  beforeEach(() => {
    mockContext = {
      userId: 'user-123',
      userName: 'John Doe',
      logger: {
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn()
      },
      openclaw: {
        tasks: {
          create: jest.fn().mockResolvedValue({
            id: 'task-456',
            title: 'Test Task'
          })
        }
      }
    };
  });
  
  it('deve criar tarefa com título válido', async () => {
    const result = await createTask(
      { title: 'Nova Tarefa', priority: 'high' },
      mockContext
    );
    
    expect(result.success).toBe(true);
    expect(result.taskId).toBe('task-456');
    expect(mockContext.openclaw.tasks.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Nova Tarefa' })
    );
  });
  
  it('deve lançar erro sem título', async () => {
    await expect(
      createTask({ priority: 'high' }, mockContext)
    ).rejects.toThrow('Título é obrigatório');
  });
});
```

### Testes de Integração
```javascript
// tests/integration.test.js
describe('Integration Tests', () => {
  it('deve sincronizar com Gmail', async () => {
    const skill = require('../src/index');
    const context = await setupTestContext();
    
    const result = await skill.handlers.syncEmails(
      { limit: 10 },
      context
    );
    
    expect(result.synced).toBeGreaterThan(0);
  });
});
```

---

## 🚀 Best Practices

### 1. Error Handling
```javascript
// ❌ Ruim
async function riskyOperation() {
  return await someAPI.call();
}

// ✅ Bom
async function riskyOperation(context) {
  try {
    const result = await someAPI.call();
    return result;
  } catch (error) {
    context.logger.error('API call failed', {
      endpoint: 'someAPI.call',
      errorMessage: error.message,
      retryable: error.code === 'ECONNRESET'
    });
    
    if (error.retryable) {
      // Retry logic
    }
    
    throw new SkillError('Operation failed', { cause: error });
  }
}
```

### 2. Performance
```javascript
// ❌ Ruim - N+1 queries
for (const taskId of taskIds) {
  const task = await context.openclaw.tasks.get(taskId);
  process(task);
}

// ✅ Bom - Batch operations
const tasks = await context.openclaw.tasks.list({
  ids: taskIds,
  limit: 1000
});
tasks.forEach(process);
```

### 3. Segurança
```javascript
// ❌ Ruim - Expõe segredos
context.logger.info('Conectando', {
  apiKey: context.secrets.get('API_KEY')
});

// ✅ Bom - Seguro
context.logger.info('Conectando', {
  apiProvider: 'ExternalAPI'
});

// ✅ Bom - Validação de entrada
function validateInput(input) {
  if (typeof input !== 'object') throw new Error('Invalid input');
  if (!input.email || !input.email.match(EMAIL_REGEX)) {
    throw new Error('Invalid email');
  }
  // Sanitize
  return {
    email: input.email.trim().toLowerCase()
  };
}
```

### 4. Memória
```javascript
// ❌ Ruim - Pode sobrecarregar memória
const allTasks = await context.openclaw.tasks.list({});

// ✅ Bom - Paginação
const paginate = async (handler) => {
  let page = 1;
  while (true) {
    const tasks = await context.openclaw.tasks.list({
      page,
      limit: 100
    });
    
    if (tasks.length === 0) break;
    
    for (const task of tasks) {
      await handler(task);
    }
    
    page++;
  }
};
```

### 5. Configuração
```javascript
// ✅ Bom - Configurável
const getConfig = (context) => ({
  maxRetries: context.settings?.max_retries || 3,
  timeout: context.settings?.timeout_ms || 5000,
  batchSize: context.settings?.batch_size || 50
});

// Usar em handlers
const handler = async (input, context) => {
  const config = getConfig(context);
  // Usar config.maxRetries, etc
};
```

---

## 📦 Publicação de Skill

### 1. Preparação
```bash
# Versioning
npm version minor  # ou major, patch

# Build
npm run build

# Testes
npm test
npm run lint

# Documentação
npm run docs
```

### 2. Arquivo de Publicação
```yaml
# .publishrc.yml
files:
  - src/
  - tests/
  - docs/
  - examples/
  - manifest.json
  - package.json
  - README.md
  - LICENSE

exclude:
  - node_modules/
  - .env
  - .git
  - *.log

validation:
  minCodeCoverage: 80
  maxBundleSize: 1000KB
  lintCheck: true
```

### 3. Publicar
```bash
# Primeiro: preparar metadados
openclaw skill prepare --skill ./

# Preview
openclaw skill validate

# Publicar
openclaw skill publish \
  --registry https://registry.openclaw.ai \
  --token YOUR_REGISTRY_TOKEN
```

### 4. Atualizar
```bash
# Atualizar versão
npm version patch

# Enviar update
openclaw skill publish --update

# Usuarios recebem update automático
```

---

## 🔄 Ciclo de Vida Completo

```javascript
// src/index.js
const manifest = require('../manifest.json');

module.exports = {
  // Metadados
  manifest,
  
  // Inicialização
  async setup(context) {
    context.logger.info('Skill iniciando');
    
    // Conectar banco, cache, etc
    await context.storage.initialize();
    
    return true;
  },
  
  // Handlers
  handlers: {
    async command(input, context) {
      // Processar comando
    }
  },
  
  // Triggers
  triggers: {
    async 'on:event:custom'(event, context) {
      // Processar evento
    }
  },
  
  // Limpeza
  async cleanup(context) {
    context.logger.info('Skill finalizando');
    
    // Fechar conexões
    await context.storage.close();
  }
};
```

---

## 📊 Monitoramento

### Métricas Importantes
```javascript
// Rastrear uso
context.logger.metric('command_executed', 1);
context.logger.metric('api_calls_made', 5);
context.logger.metric('errors_occurred', 0);
context.logger.metric('processing_time_ms', 234);

// Alertar se anômalo
if (processingTime > 5000) {
  context.logger.warn('Slow processing detected', {
    processingTime,
    threshold: 5000
  });
}
```

### Dashboard
- Acesso em: `openclaw-dev dashboard`
- Mostra: execuções, erros, performance, uso

---

## 🆘 Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| Skill não inicia | Erro em manifest.json | Validar JSON |
| Permissões negadas | Falta permissão em manifest | Adicionar em `permissions` |
| Performance lenta | Query N+1 | Usar batch operations |
| Vazamento de memória | Listeners não removidos | Cleanup handler |
| Erros aleatórios | Race condition | Usar locks/transactions |

---

## 📚 Referências

- [API Docs Completa](https://docs.openclaw.ai)
- [Exemplos de Skills](https://github.com/openclaw-skills/examples)
- [Best Practices Guide](https://docs.openclaw.ai/best-practices)
- [Community Forum](https://forum.openclaw.ai)

---

## 🔗 Próximos Passos

- [Voltar para Top Skills](openclaw-melhores-skills-comunidade.md)
- [Ver Ecossistema 2026](openclaw-ecossistema-comunidade-2026.md)
- [Explorar Prompts Avançados](prompts-openclaw-automacao.md)

---

*Última atualização: 24 de fevereiro de 2026*
*Versão: 1.0*
