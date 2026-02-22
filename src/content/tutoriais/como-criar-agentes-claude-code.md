---
title: "Como Criar Agentes com Claude Code"
slug: "como-criar-agentes-claude-code"
category: "tutoriais"
date: "2026-02-22"
author: "Saraiva"
description: "Tutorial avancado para instalar o Claude Code, criar agentes autonomos e usar o MCP para automacao de tarefas de desenvolvimento."
tags: ["agentes", "claude-code", "desenvolvimento"]
image: ""
source: ""
featured: false
difficulty: "avancado"
---

## O que e o Claude Code e por que ele muda tudo

O Claude Code e a interface de linha de comando oficial da Anthropic para o Claude. Diferente do chat web, ele opera diretamente no seu terminal, le e edita arquivos, executa comandos e cria agentes autonomos que trabalham em paralelo.

Para desenvolvedores e profissionais tecnicos, isso significa ter um assistente que realmente executa tarefas no seu ambiente, nao apenas sugere codigo.

Neste tutorial, voce vai instalar o Claude Code, criar seus primeiros agentes e aprender a usar o Model Context Protocol (MCP) para conectar ferramentas externas.

## Passo 1: Instalando o Claude Code

### Pre-requisitos

- Node.js 18 ou superior
- npm ou npx
- Conta na Anthropic com API key (ou uso via Claude Max/Pro)
- Terminal (macOS, Linux ou WSL no Windows)

### Instalacao

Abra seu terminal e execute:

```bash
npm install -g @anthropic-ai/claude-code
```

Ou use diretamente com npx sem instalar globalmente:

```bash
npx @anthropic-ai/claude-code
```

### Configuracao inicial

Na primeira execucao, o Claude Code vai solicitar autenticacao. Voce tem duas opcoes:

1. **API Key direta:** exporte a variavel de ambiente `ANTHROPIC_API_KEY`
2. **Login interativo:** o Claude Code abre o navegador para autenticacao

Para configurar a API key:

```bash
export ANTHROPIC_API_KEY="sk-ant-sua-chave-aqui"
```

Adicione essa linha ao seu `.bashrc` ou `.zshrc` para persistir entre sessoes.

### Verificando a instalacao

Execute `claude` no terminal. Voce deve ver o prompt interativo do Claude Code. Digite uma pergunta simples para testar a conexao.

## Passo 2: Entendendo o ambiente do Claude Code

### O que o Claude Code pode fazer

Diferente do chat web, o Claude Code tem acesso direto ao seu sistema de arquivos e terminal:

- Ler e editar qualquer arquivo no diretorio atual
- Executar comandos no terminal (build, test, git)
- Navegar pela estrutura do projeto
- Criar e modificar arquivos
- Executar testes e verificar resultados

### O arquivo CLAUDE.md

O `CLAUDE.md` e o arquivo de configuracao principal. Ele fica na raiz do projeto e define:

- Regras de comportamento
- Padroes de codigo
- Comandos de build e teste
- Restricoes de seguranca
- Estrutura do projeto

Faca isso agora: crie um arquivo `CLAUDE.md` na raiz do seu projeto com as instrucoes basicas sobre sua stack, padroes de codigo e comandos de build.

### Contexto de projeto

O Claude Code le automaticamente:

- `CLAUDE.md` na raiz do projeto
- `.claude/` diretorio de configuracoes
- Arquivos de configuracao do projeto (package.json, tsconfig.json)
- Historico de git para entender mudancas recentes

## Passo 3: Criando seu primeiro agente

### O que e um agente no Claude Code

Um agente e uma instancia do Claude que recebe uma tarefa especifica e trabalha de forma autonoma ate concluir. Diferente de um chat onde voce vai e volta, o agente planeja, executa e reporta.

### Agente simples via Task tool

No Claude Code, voce pode pedir para ele criar agentes usando a funcionalidade de Task. O conceito e simples:

1. Voce define a tarefa
2. O agente planeja os passos
3. Executa cada passo (le arquivos, edita codigo, roda testes)
4. Reporta o resultado

### Exemplo pratico: agente de refatoracao

Inicie o Claude Code no diretorio do seu projeto e peca:

"Analise o arquivo src/utils/helpers.ts. Identifique funcoes que podem ser divididas em funcoes menores. Refatore mantendo os mesmos testes passando. Execute os testes apos cada mudanca."

O Claude vai:
1. Ler o arquivo
2. Identificar funcoes longas
3. Propor a refatoracao
4. Implementar as mudancas
5. Executar os testes
6. Corrigir se algum teste falhar

### Exemplo pratico: agente de testes

"Analise o diretorio src/components/ e identifique componentes sem testes. Para cada componente sem teste, crie um arquivo de teste em tests/components/ seguindo o padrao dos testes existentes. Execute todos os testes ao final."

## Passo 4: Usando o MCP (Model Context Protocol)

### O que e o MCP

O Model Context Protocol e um padrao aberto que permite conectar o Claude a ferramentas externas. Pense nele como plugins que estendem as capacidades do Claude.

### Configurando MCP servers

Crie um arquivo `.mcp.json` na raiz do projeto:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/caminho/do/projeto"]
    }
  }
}
```

### MCP servers uteis

Existem dezenas de MCP servers disponiveis. Os mais uteis para desenvolvimento:

**Filesystem:** acesso a arquivos e diretorios
```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
}
```

**GitHub:** integracao com repositorios, PRs e issues
```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_TOKEN": "ghp_seu_token" }
}
```

**Database:** consultas SQL em bancos de dados
```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@host/db"]
}
```

### Usando MCP tools no Claude Code

Apos configurar o MCP, as ferramentas ficam disponiveis automaticamente. O Claude pode:

- Ler issues do GitHub e criar PRs
- Consultar banco de dados para entender a estrutura
- Acessar APIs externas para buscar informacoes
- Interagir com servicos de terceiros

## Passo 5: Agentes especializados

### Agente de Code Review

Configure o Claude Code para revisar pull requests automaticamente:

"Revise o PR #42 no repositorio. Analise: 1) Qualidade do codigo, 2) Potenciais bugs, 3) Performance, 4) Seguranca, 5) Aderencia aos padroes do projeto. Gere um comentario de review estruturado."

### Agente de Documentacao

"Analise todos os arquivos em src/services/ e gere documentacao JSDoc para funcoes publicas que estao sem documentacao. Mantenha o estilo consistente com a documentacao existente."

### Agente de Migracao

"Migre todos os componentes React em src/components/ de class components para functional components com hooks. Mantenha os mesmos testes passando. Execute os testes apos cada migracao."

### Agente de Seguranca

"Analise o projeto procurando: 1) Dependencias com vulnerabilidades conhecidas, 2) Secrets ou chaves hardcoded no codigo, 3) Inputs do usuario sem validacao, 4) Injecoes SQL ou XSS possiveis. Gere um relatorio de seguranca."

## Passo 6: Trabalhando com multiplos agentes

### O conceito de swarm

Um swarm e um grupo de agentes trabalhando em paralelo em tarefas relacionadas. Cada agente tem uma especialidade e eles compartilham informacoes via memoria.

### Inicializando um swarm

Usando o Claude Flow (extensao do Claude Code para orquestracao):

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 6
```

### Definindo agentes no swarm

Cada agente tem um papel:

- **Planner:** analisa a tarefa e divide em subtarefas
- **Coder:** implementa as mudancas no codigo
- **Tester:** cria e executa testes
- **Reviewer:** revisa o codigo gerado
- **Docs:** atualiza documentacao

### Executando o swarm

O coordenador distribui tarefas e cada agente trabalha de forma independente. Quando todos terminam, os resultados sao consolidados.

Isso e particularmente util para tarefas grandes como:

- Migracoes de framework
- Refatoracoes amplas
- Implementacao de features complexas
- Auditorias de seguranca completas

## Passo 7: Boas praticas

### Seguranca

- Nunca coloque API keys no CLAUDE.md ou em arquivos commitados
- Use variaveis de ambiente para secrets
- Revise as acoes do agente antes de confirmar mudancas sensíveis
- Configure limites no arquivo de configuracao

### Produtividade

- Comece com tarefas pequenas e aumente a complexidade
- Use o CLAUDE.md para ensinar padroes do seu projeto
- Mantenha testes atualizados para que agentes possam validar mudancas
- Salve prompts que funcionam bem para reutilizar

### Custos

- Cada interacao consome tokens da API
- Agentes complexos podem consumir milhares de tokens
- Monitore seu uso no painel da Anthropic
- Use modelos menores para tarefas simples

## Conclusao

O Claude Code e agentes de IA representam uma mudanca fundamental na forma como desenvolvedores trabalham. Em vez de escrever cada linha de codigo manualmente, voce se torna um arquiteto e revisor, delegando a implementacao para agentes inteligentes.

Comece instalando o Claude Code hoje e automatize uma tarefa repetitiva do seu workflow. Pode ser algo simples como gerar testes para um componente ou revisar um PR. A curva de aprendizado e rapida e o retorno em produtividade e imediato.
