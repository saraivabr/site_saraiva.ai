---
title: "Como Criar Skills no OpenClaw"
slug: "como-criar-skills-openclaw"
category: "tutoriais"
date: "2026-02-24"
author: "Saraiva"
description: "Guia completo para desenvolver Skills customizadas no OpenClaw, seu assistente de IA pessoal. Aprenda a estrutura, publicação e integração com APIs externas."
tags: ["openclaw", "skills", "desenvolvimento", "automação", "ia-pessoal"]
difficulty: "avancado"
duration: "45 min"
---

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
    this.name = 'minha-skill';
  }

  // Comando principal
  async buscar(params) {
    const { query } = params;
    
    if (!query) {
      throw new Error('Query é obrigatória');
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
    return { query, resultado: 'dados processados' };
  }

  // Hook de inicialização
  async init() {
    console.log('MinhaSkill inicializada');
  }

  // Hook de limpeza
  async cleanup() {
    console.log('MinhaSkill finalizada');
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
const axios = require('axios');

class CryptoPriceSkill {
  constructor(config = {}) {
    this.config = config;
    this.name = 'crypto-price';
    this.api_url = 'https://api.coingecko.com/api/v3';
  }

  async preco(params) {
    const { moeda = 'bitcoin', moeda_base = 'usd' } = params;
    
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
            vs_currency: 'usd',
            order: 'market_cap_desc',
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
    console.log('CryptoPriceSkill inicializada');
  }

  async cleanup() {
    console.log('CryptoPriceSkill finalizada');
  }
}

module.exports = CryptoPriceSkill;
```

### Passo 4: Criar Exemplo de Uso

Crie `examples/exemplo-basico.js`:

```javascript
const CryptoPriceSkill = require('../skill');

(async () => {
  const skill = new CryptoPriceSkill();
  
  // Buscar preço do Bitcoin
  const bitcoin = await skill.preco({ 
    moeda: 'bitcoin' 
  });
  console.log('Bitcoin:', bitcoin);

  // Buscar top 10
  const top = await skill.top10({});
  console.log('Top 10:', top);
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
        'API_KEY não configurada. ' +
        'Configure MINHA_SKILL_API_KEY como variável de ambiente.'
      );
    }
  }

  async fazer_algo() {
    const response = await axios.get('https://api.exemplo.com/dados', {
      headers: {
        'Authorization': `Bearer ${this.api_key}`,
        'User-Agent': 'OpenClaw/1.0'
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
    return { dados: 'resultado' };
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

\`\`\`bash
openclaw skill install crypto-price
\`\`\`

## Uso

\`\`\`javascript
// No seu OpenClaw
const preco = await skill.preco({ moeda: 'bitcoin' });
\`\`\`

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
      stack: process.env.NODE_ENV === 'development' ? erro.stack : undefined
    };
  }
}

validar(params) {
  if (!params || typeof params !== 'object') {
    throw new Error('Parametros inválidos');
  }
}
```

### Rate Limiting

```javascript
const pQueue = require('p-queue');

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
const axios = require('axios');

class DevToSkill {
  async buscar_artigos(params) {
    const { tag = 'javascript', limite = 5 } = params;
    
    const response = await axios.get('https://dev.to/api/articles', {
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
    const { pipeline } = await import('@xenova/transformers');
    const summarizer = await pipeline('summarization', 'Xenova/bart-large-cnn');
    
    const resultado = await summarizer(texto, { max_length: 100 });
    
    return {
      sucesso: true,
      original_palavras: texto.split(' ').length,
      resumo: resultado[0].summary_text,
      taxa_compressao: '70%'
    };
  }
}

module.exports = ResumoSkill;
```

## Testes para Sua Skill

```javascript
const CryptoPriceSkill = require('../skill');
const assert = require('assert');

describe('CryptoPriceSkill', () => {
  let skill;

  before(() => {
    skill = new CryptoPriceSkill();
  });

  it('deve buscar preço do Bitcoin', async () => {
    const resultado = await skill.preco({ moeda: 'bitcoin' });
    assert.strictEqual(resultado.sucesso, true);
    assert.ok(resultado.dados.preco);
  });

  it('deve retornar top 10', async () => {
    const resultado = await skill.top10({});
    assert.strictEqual(resultado.sucesso, true);
    assert.strictEqual(resultado.top_10.length, 10);
  });

  it('deve tratar moeda inválida', async () => {
    const resultado = await skill.preco({ moeda: 'xyzinvalido' });
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
