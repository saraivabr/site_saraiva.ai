---
title: "Como Criar um Chatbot de WhatsApp com IA"
slug: "como-criar-chatbot-whatsapp-ia"
category: "tutoriais"
date: "2026-02-22"
author: "Saraiva"
description: "Passo a passo para criar um chatbot inteligente de WhatsApp usando plataformas como Manychat, Botpress ou API direta, com custos e melhores praticas."
tags: ["whatsapp", "chatbot", "atendimento"]
image: ""
source: ""
featured: false
difficulty: "intermediario"
---

## Por que ter um chatbot de WhatsApp com IA

O WhatsApp e o principal canal de comunicacao no Brasil, com mais de 170 milhoes de usuarios. Se seus clientes estao no WhatsApp, seu atendimento tambem precisa estar.

Um chatbot com IA vai alem de respostas automaticas pre-definidas. Ele entende perguntas em linguagem natural, responde de forma personalizada e resolve a maioria das demandas sem precisar de um atendente humano.

Neste tutorial, voce vai aprender as opcoes disponiveis, quanto custa cada uma e como implementar na pratica.

## Conhecendo as opcoes

### Opcao 1: Manychat

**O que e:** plataforma visual de automacao focada em WhatsApp, Instagram e Messenger.

**Melhor para:** quem quer comecar rapido sem programacao.

**Preco:** a partir de USD 15/mes para WhatsApp (plano Pro).

**Limitacoes:** a integracao com IA generativa (ChatGPT) e basica e requer plano mais caro.

### Opcao 2: Botpress

**O que e:** plataforma de chatbot com IA nativa, interface visual e suporte a multiplos canais.

**Melhor para:** quem quer um chatbot realmente inteligente com fluxos complexos.

**Preco:** plano gratuito generoso, planos pagos a partir de USD 15/mes.

**Destaque:** integra GPT e Claude nativamente, entende contexto e mantem conversas longas.

### Opcao 3: API direta (WhatsApp Business API + OpenAI/Claude)

**O que e:** construir o chatbot do zero usando as APIs oficiais.

**Melhor para:** equipes tecnicas que querem controle total.

**Preco:** custos de API do WhatsApp (por conversa) + custos de API da IA (por token).

**Destaque:** maximo controle e personalizacao, mas exige desenvolvimento.

### Comparacao rapida

| Criterio | Manychat | Botpress | API direta |
|----------|----------|----------|------------|
| Dificuldade | Facil | Medio | Avancado |
| Inteligencia IA | Basica | Avancada | Total |
| Custo mensal | R$ 80-300 | R$ 0-150 | Variavel |
| Tempo de setup | 1-2 horas | 2-4 horas | 1-2 semanas |
| Personalizacao | Media | Alta | Total |

## Passo 1: Preparando o WhatsApp Business

### Conta do WhatsApp Business

Independente da plataforma escolhida, voce precisa de:

1. Uma conta no WhatsApp Business (nao o WhatsApp comum)
2. Um numero de telefone dedicado ao atendimento
3. Verificacao da empresa no Meta Business Suite

### Verificando sua empresa no Meta

1. Acesse [business.facebook.com](https://business.facebook.com)
2. Crie ou acesse sua conta Business
3. Va em Configuracoes > Central de Seguranca > Verificacao da empresa
4. Envie os documentos solicitados (CNPJ, contrato social)
5. Aguarde a aprovacao (pode levar de 1 a 7 dias)

Faca isso agora: se voce ainda nao tem a verificacao da empresa no Meta, inicie o processo hoje. Ele e obrigatorio para qualquer integracao profissional de WhatsApp.

## Passo 2: Implementando com Manychat

### Configuracao inicial

1. Crie conta em [manychat.com](https://manychat.com)
2. Conecte seu numero do WhatsApp Business
3. Siga o wizard de configuracao

### Criando seu primeiro fluxo

1. Va em "Automations" > "New Automation"
2. Escolha o gatilho: "When someone sends a message"
3. Adicione condicoes baseadas em palavras-chave:
   - "preco" ou "quanto custa" leva ao fluxo de precos
   - "horario" ou "funciona" leva ao fluxo de informacoes
   - "falar" ou "atendente" leva ao fluxo de transferencia

### Adicionando IA ao Manychat

No plano Pro com AI:

1. Adicione o bloco "AI Step" no fluxo
2. Configure o prompt do sistema: "Voce e o assistente virtual da [empresa]. Responda perguntas sobre nossos produtos e servicos. Se nao souber a resposta, transfira para um atendente."
3. Adicione o conhecimento da empresa (FAQ, catalogo, politicas)
4. Teste com perguntas variadas

### Limitacoes do Manychat

- A IA nao mantem contexto longo entre mensagens
- Personalizacao do comportamento da IA e limitada
- Para fluxos complexos, a interface visual pode ficar confusa

## Passo 3: Implementando com Botpress

### Por que o Botpress se destaca

O Botpress foi construido pensando em IA conversacional. Ele entende intencoes, mantem contexto e permite criar "personalidades" para o chatbot.

### Configuracao

1. Crie conta em [botpress.com](https://botpress.com)
2. Crie um novo bot
3. Na secao de integracao, conecte o WhatsApp
4. Siga as instrucoes para configurar o webhook do WhatsApp

### Configurando a base de conhecimento

1. Va em "Knowledge Base" no painel do bot
2. Adicione fontes de conhecimento:
   - URLs do seu site (o Botpress rastreia e indexa)
   - Documentos PDF (catalogo, FAQ, manual)
   - Texto direto (perguntas e respostas frequentes)
3. O bot usa essas fontes para responder perguntas

### Definindo a personalidade

No Botpress, voce configura um "System Prompt" que define o comportamento:

"Voce e a Sofia, assistente virtual da [empresa]. Seu tom e profissional, amigavel e objetivo. Voce ajuda clientes com: informacoes sobre produtos, precos, prazos de entrega e suporte pos-venda. Quando nao souber a resposta, diga honestamente e oferca transferir para um atendente humano. Sempre responda em portugues do Brasil."

### Criando fluxos no Botpress

1. **Boas-vindas:** mensagem inicial quando o cliente entra em contato
2. **FAQ automatico:** respostas baseadas na Knowledge Base
3. **Qualificacao:** perguntas para entender a necessidade do cliente
4. **Encaminhamento:** transferir para humano quando necessario
5. **Feedback:** pedir avaliacao apos o atendimento

### Testando

Use o simulador integrado do Botpress para testar:

1. Envie mensagens como um cliente faria
2. Verifique se as respostas estao corretas
3. Ajuste a Knowledge Base quando encontrar lacunas
4. Teste cenarios de falha (perguntas fora do escopo)

## Passo 4: Implementando com API direta

### Arquitetura basica

Para quem quer controle total, a arquitetura e:

1. WhatsApp Business API (recebe e envia mensagens)
2. Seu servidor (processa a logica)
3. API da OpenAI ou Anthropic (gera respostas inteligentes)

### Provedores de API do WhatsApp

Voce nao acessa a API do WhatsApp diretamente. Precisa de um provedor:

- **Meta Cloud API:** gratuito, direto do Meta
- **Twilio:** a partir de USD 0.005 por mensagem
- **360dialog:** popular no Brasil, bom suporte local
- **Gupshup:** opcao com bom custo-beneficio

### Fluxo simplificado

1. Cliente envia mensagem no WhatsApp
2. O provedor recebe e envia para seu webhook
3. Seu servidor processa a mensagem
4. Envia o texto para a API da OpenAI/Claude
5. Recebe a resposta da IA
6. Envia de volta ao cliente via WhatsApp

### Custos da API direta

- **WhatsApp (Meta Cloud API):** primeiras 1.000 conversas/mes gratuitas, depois R$ 0,25-0,50 por conversa
- **OpenAI (GPT-4o-mini):** aproximadamente USD 0.15 por 1 milhao de tokens (centavos por conversa)
- **Servidor:** a partir de R$ 50/mes em servicos como Railway ou Render
- **Total estimado:** R$ 200-500/mes para 1.000 conversas

## Passo 5: Melhores praticas de chatbot

### Definindo o escopo

Antes de lancar, defina claramente:

- O que o chatbot DEVE responder (80% das perguntas comuns)
- O que o chatbot NAO deve responder (questoes sensiveis, reclamacoes graves)
- Quando transferir para humano (regras claras)

### Mensagem de boas-vindas

A primeira mensagem define a experiencia. Modelo recomendado:

"Ola! Eu sou a [nome], assistente virtual da [empresa]. Posso ajudar com informacoes sobre nossos produtos, precos e prazos. Como posso te ajudar hoje?"

Evite menus longos na primeira mensagem. Deixe o cliente perguntar naturalmente.

### Transferencia para humano

Defina gatilhos claros para transferencia:

- Cliente pede explicitamente para falar com uma pessoa
- Chatbot nao consegue responder apos 2 tentativas
- Assunto envolve reclamacao ou problema critico
- Negociacao de valores ou condicoes especiais

### Horario de atendimento

Configure respostas diferentes para fora do horario:

"Nosso atendimento humano funciona de segunda a sexta, das 9h as 18h. Posso tentar te ajudar agora com informacoes basicas, ou se preferir, registre sua pergunta e um atendente vai responder no proximo dia util."

### Metricas para acompanhar

- **Taxa de resolucao:** % de conversas resolvidas sem humano
- **Tempo medio de resposta:** velocidade do chatbot
- **Satisfacao (CSAT):** avaliacao pos-atendimento
- **Taxa de transferencia:** % de conversas escaladas para humano
- **Perguntas sem resposta:** gaps na Knowledge Base

## Passo 6: Conformidade e regulamentacao

### LGPD e chatbots

Seu chatbot deve estar em conformidade com a LGPD:

- Informe ao usuario que ele esta conversando com um bot
- Tenha uma politica de privacidade acessivel
- Nao armazene dados pessoais alem do necessario
- Oferca opcao para o usuario solicitar exclusao de dados
- Obtenha consentimento antes de enviar mensagens proativas

### Regras do WhatsApp Business

O WhatsApp tem regras rigorosas:

- Mensagens proativas (templates) precisam de aprovacao previa
- Nao envie spam ou mensagens em massa sem consentimento
- Responda dentro de 24 horas (janela de atendimento)
- Fora da janela de 24h, use apenas templates aprovados

## Passo 7: Lancamento e otimizacao

### Lancamento gradual

1. **Semana 1:** ative para um grupo pequeno de clientes
2. **Semana 2:** analise as conversas e ajuste respostas
3. **Semana 3:** expanda para mais clientes
4. **Semana 4:** ative para todos e monitore metricas

### Otimizacao continua

- Revise semanalmente as perguntas sem resposta
- Atualize a Knowledge Base com novos produtos e politicas
- Ajuste o tom conforme feedback dos clientes
- Adicione novos fluxos conforme demandas recorrentes

## Conclusao

Um chatbot de WhatsApp com IA nao substitui o atendimento humano, mas libera sua equipe para focar nos casos que realmente precisam de atencao pessoal. Para a maioria das empresas brasileiras, o Botpress oferece o melhor equilibrio entre facilidade de uso e inteligencia do chatbot.

Comece com o escopo mais basico possível: responder as 10 perguntas mais frequentes dos seus clientes. Depois, expanda gradualmente. Um chatbot que responde bem 10 perguntas e melhor que um que tenta responder 100 e erra em metade.
