# Prompts OpenClaw para Automação

Domine a automação com OpenClaw: automação de email, scraping, integrações com APIs, cron jobs e workflows complexos multi-step.

## 📧 Automação de Email (12 prompts)

### 1. Pipeline de Email Automático
```
Crie pipeline automático:
1. Receber email de [fonte]
2. Extrair [informações] e salvar em [arquivo/banco]
3. Enviar email de confirmação para [destinatário]
4. Registrar em [sistema]
Teste com email de exemplo.
```
**Exemplo:**
```
Crie pipeline automático:
1. Receber email de contato@empresa.com
2. Extrair nome, email e mensagem e salvar em leads.csv
3. Enviar email de confirmação para remetente
4. Registrar em CRM
Teste com email de exemplo.
```

---

### 2. Processamento de Anexos
```
Quando receber email com assunto contendo "[padrão]":
1. Baixe anexos
2. Processe [tipo de arquivo]: [instrução]
3. Salve resultado em [destino]
4. Notifique [pessoa] por [meio]
```
**Exemplo:**
```
Quando receber email com assunto contendo "relatório":
1. Baixe anexos
2. Processe PDF: extraia tabelas e converta em Excel
3. Salve resultado em /documentos/relatorios
4. Notifique gerente por Slack
```

---

### 3. Triagem Inteligente
```
Classifique automaticamente emails recebidos em [destinatário]:
- Importante: contém [critério 1] → Pasta: [pasta 1] → Ação: [ação 1]
- Urgente: contém [critério 2] → Pasta: [pasta 2] → Ação: [ação 2]
- Lixo: contém [critério 3] → Pasta: [pasta 3] → Ação: [ação 3]
Crie rótulos com cores.
```
**Exemplo:**
```
Classifique automaticamente emails recebidos:
- Importante: de cliente OR "URGENT" → Inbox destacado → Notifique-me
- Processo: de sistema OR "automático" → Arquivo → Registre evento
- Lixo: marketing OR promoção → Spam → Desinscreva
Crie rótulos com cores.
```

---

### 4. Resposta Automática Inteligente
```
Para emails com assunto "[padrão]" de [pessoas/domínios]:
1. Reconheça tipo de solicitação: [tipos]
2. Se [tipo 1]: responda com template "[template 1]"
3. Se [tipo 2]: responda com template "[template 2]"
4. Se desconhecido: encaminhe para [pessoa]
Aprenda padrões ao longo do tempo.
```
**Exemplo:**
```
Para emails com assunto contendo "feedback" de clientes:
1. Reconheça tipo: elogio, crítica, sugestão
2. Se elogio: responda com agradecimento entusiasta
3. Se crítica: responda com template de resolução
4. Se sugestão: encaminhe para product@empresa
Aprenda padrões ao longo do tempo.
```

---

### 5. Sincronização de Emails para CRM
```
Sincronize automaticamente:
- Email recebido de [domínio] → Crie/atualize contato em [CRM]
- Extraia: nome, empresa, número, assunto da mensagem
- Crie tarefa de follow-up em [dias] se [condição]
- Mantenha histórico de conversas
```
**Exemplo:**
```
Sincronize automaticamente:
- Email recebido de prospectos → Crie/atualize contato em Salesforce
- Extraia: nome, empresa, número, interesse
- Crie tarefa de follow-up em 3 dias se não responder
- Mantenha histórico de conversas
```

---

### 6. Envio em Massa Automático
```
Crie campanha de email:
- Destinatários: [lista/arquivo CSV]
- Template: [template]
- Agendamento: [data/hora] ou [dia da semana]
- Personalização: substitua [variáveis] de cada linha
- Rastreamento: aberturas, cliques, respostas
- Follow-up: [dias] depois se sem resposta
```
**Exemplo:**
```
Crie campanha de newsletter:
- Destinatários: newsletter.csv (5.000 contatos)
- Template: "Newsletter - {mes}"
- Agendamento: terça-feira 09:00
- Personalização: {nome}, {empresa}, {produto_interesse}
- Rastreamento: aberturas, cliques, respostas
- Follow-up: 7 dias depois se sem clique
```

---

### 7. Consolidação de Emails
```
Diariamente, consolide emails de [fontes]:
- Resuma assunto e remetente em [formato]
- Agrupe por [critério]: categoria, urgência, projeto
- Envie resumo para [email] em [horário]
- Inclua links diretos para cada email
```
**Exemplo:**
```
Diariamente, consolide emails:
- Resuma assunto e remetente em HTML
- Agrupe por: clientes, fornecedores, time interno
- Envie resumo para diretor@empresa.com às 08:00
- Inclua links diretos para cada email
```

---

### 8. Assinatura Dinâmica
```
Configure assinatura automática que:
- Mude conforme [contexto]: cargo, projeto, localização
- Inclua [elementos]: nome, cargo, contatos
- Atualize para feriados: [mensagem especial]
- Aplique a todos os emails saindo de [conta]
```
**Exemplo:**
```
Configure assinatura automática que:
- Mude conforme projeto: gerenciador de projetos vs designer
- Inclua: nome, cargo, LinkedIn, número, website
- Atualize para férias: "Retorno em 10 de março"
- Aplique a todos os emails corporativos
```

---

### 9. Arquivo e Backup Automático
```
Automaticamente, a cada [frequência]:
1. Archive emails mais antigos que [dias] para [plataforma]
2. Backup de anexos em [storage]
3. Crie índice pesquisável de emails arquivados
4. Notifique quando espaço em disco for [%]
```
**Exemplo:**
```
Automaticamente, toda segunda-feira:
1. Archive emails mais antigos que 6 meses para Google Drive
2. Backup de todos os anexos em AWS S3
3. Crie índice pesquisável de emails arquivados
4. Notifique quando espaço for menos que 10%
```

---

### 10. Bloqueio e Filtro Avançado
```
Para emails de [remetentes/domínios]:
- Se contiver [palavras]: bloqueie e reporte como spam
- Se for [tipo]: marque como lido automaticamente
- Se der erro: quarentena para revisão
- Exceções: whitelist [remetentes confiáveis]
```
**Exemplo:**
```
Para emails suspeitos:
- Se contiver "clique aqui": bloqueie e reporte como phishing
- Se for confirmação de sistema: marque como lido automaticamente
- Se der erro de processamento: quarentena para revisão
- Exeções: whitelist contatos verificados
```

---

### 11. Rastreamento de Conversas
```
Para cada conversa com [critério]:
- Rastreie todas as mensagens relacionadas
- Mostre timeline: quem respondeu, quando, conteúdo resumido
- Alerte se sem resposta por [dias]
- Crie tarefa de follow-up automático
```
**Exemplo:**
```
Para cada conversa com cliente:
- Rastreie todas as mensagens relacionadas
- Mostre timeline: quem respondeu, quando, resumo
- Alerte se sem resposta por 2 dias
- Crie tarefa de follow-up automático
```

---

### 12. Integração com Calendário
```
Quando receber email com:
- Data e horário mencionados → sugira criar evento no calendário
- Participantes → adicione automaticamente
- Local/link de reunião → extraia e inclua
- Pergunte se deseja agendar [antes de processar]
```
**Exemplo:**
```
Quando receber email de reunião:
- Se contiver "28 de fevereiro às 14:00" → sugira criar evento
- Extraia participantes do email
- Se contiver "Meet:" → extraia link
- Confirme antes de criar evento
```

---

## 🕷️ Scraping e Monitoramento (10 prompts)

### 13. Monitoramento de Website
```
Monitore [website/URL] a cada [frequência]:
- Verifique alterações em: [seletores CSS/elementos]
- Se mudar, extraia novo conteúdo
- Notifique via [canal]: email, Slack, SMS
- Mantenha histórico de mudanças
```
**Exemplo:**
```
Monitore https://concorrente.com a cada 6 horas:
- Verifique alterações em: preços, produtos novos, promoções
- Se mudar, extraia novo preço e descrição
- Notifique via Slack
- Mantenha histórico com timestamps
```

---

### 14. Scraping de Dados Estruturados
```
Extraia dados de [website]:
- Identifique estrutura: [tipo de dados]
- Para cada item, extraia: [campos]
- Salve em [formato]: CSV, JSON, banco de dados
- Deduplication e validação automática
```
**Exemplo:**
```
Extraia produtos de e-commerce:
- Identifique estrutura: grid de produtos
- Para cada item, extraia: nome, preço, foto, classificação
- Salve em JSON com timestamp
- Remova duplicatas por SKU
```

---

### 15. Alerta de Preço
```
Monitore preços de [produtos/itens]:
- Verifique preço atual a cada [frequência]
- Se abaixar mais de [%] ou chegar a [valor]: notifique
- Mantenha histórico de preços
- Sugira melhor momento para comprar (tendência)
```
**Exemplo:**
```
Monitore preços em marketplaces:
- Verifique laptop específico a cada 24 horas
- Se abaixar mais de 10%: notifique via SMS
- Mantenha histórico com gráfico
- Sugira melhor momento para comprar
```

---

### 16. Scraping de RSS/News
```
Monitore fontes RSS/news de [tópicos]:
- Verifique a cada [frequência]
- Filtre apenas: [critérios relevantes]
- Resuma cada artigo: título, resumo 1-2 linhas, link
- Agrupe por [categoria]
- Envie digest para [email]
```
**Exemplo:**
```
Monitore notícias sobre tecnologia:
- Verifique a cada 6 horas
- Filtre apenas: IA, machine learning, arquitetura
- Resuma cada artigo: título, resumo breve, link
- Agrupe por fonte
- Envie digest matinal às 08:00
```

---

### 17. Scraping de Redes Sociais
```
Monitore [rede social, @conta, hashtag]:
- Verifique a cada [frequência]
- Se encontrar: [critério] → capture e processe
- Extraia: texto, imagem, comentários, engajamento
- Classifique por [tipo]: menção, tag, resposta
- Ação: [notifique, responda, archive]
```
**Exemplo:**
```
Monitore tweets sobre marca:
- Verifique a cada 30 minutos
- Se encontrar menção ou hashtag → capture
- Extraia: texto, autor, retweets, respostas
- Classifique por sentimento: positivo, negativo, neutro
- Ação: notifique time de marketing
```

---

### 18. Disponibilidade de Produto
```
Monitore disponibilidade de [produto] em [lojas]:
- Verifique a cada [frequência]
- Quando disponível em [loja]: notifique
- Extraia: preço, estoque, link direto
- Se muito barato: crie alerta extra
```
**Exemplo:**
```
Monitore disponibilidade de console PS5:
- Verifique a cada 1 hora
- Quando disponível em Amazon: notifique via SMS
- Extraia: preço, quantidade, link direto para carrinho
- Se abaixo de R$ 3.000: alerta urgente
```

---

### 19. Monitoramento de Concorrência
```
Monitore [concorrentes]:
- Página, preços, produtos, promoções, postagens
- Frequência: [periódica]
- Compare com seus dados: [campos]
- Relatório: [diário/semanal] com destaques
- Alerte se mudança significativa: [%]
```
**Exemplo:**
```
Monitore 3 concorrentes principais:
- Preços, produtos novos, promoções, posts sociais
- Frequência: 2x por dia
- Compare preços com seus produtos similares
- Relatório semanal com análise
- Alerte se reduzir preço mais de 15%
```

---

### 20. Captura de Screenshots
```
Para [websites/URLs]:
- Capture screenshot a cada [frequência]
- Salve com timestamp
- Detecte mudanças visuais: [sensibilidade]
- Se mudança significativa: notifique + anexe imagem anterior/nova
```
**Exemplo:**
```
Para site de concorrente:
- Capture screenshot diariamente às 09:00
- Salve com timestamp
- Detecte mudanças visuais: layout, cores, produtos em destaque
- Se mudança: notifique via email com antes/depois
```

---

### 21. Extração de Dados de Tabelas
```
De [website/PDF]:
- Identifique tabelas: [número ou seletor]
- Extraia todos os dados
- Converta para [formato]: CSV, Excel, JSON
- Normalize: [remova caracteres especiais, uniformize datas, etc.]
- Salve em [local]
```
**Exemplo:**
```
De relatório financeiro em PDF:
- Identifique tabelas de receita por trimestre
- Extraia todos os dados
- Converta para Excel
- Normalize valores monetários: remova símbolo, padronize decimais
- Salve em /documentos/financeiro/2026-Q1.xlsx
```

---

### 22. Validação de Dados Scrapeados
```
Após scraping, valide:
- Formato: [critérios de formato]
- Completude: [campos obrigatórios]
- Deduplicação: [campo chave]
- Outliers: [alertas para valores anormais]
- Relatório: [problemas encontrados]
```
**Exemplo:**
```
Após scraping de produtos:
- Formato: preço = número com 2 decimais
- Completude: nome, descrição, preço obrigatórios
- Deduplicação: por SKU
- Outliers: preço > 10x média ou < 10% mínimo
- Relatório: quantos erros, quais produtos afetados
```

---

## 🔌 Integrações com APIs (12 prompts)

### 23. Sincronização Bidirecional
```
Sincronize [sistema A] ↔ [sistema B]:
- Frequência: [periódica ou real-time]
- Mapeamento de campos: [A.campo1] ↔ [B.campo1]
- Conflito se mudar em ambos: [resolução]
- Log de sincronização
- Teste de integridade
```
**Exemplo:**
```
Sincronize Shopify ↔ Google Sheets:
- Frequência: a cada 6 horas
- Mapeamento: produto Shopify → linha Sheets
- Conflito: priorize versão Shopify (fonte de verdade)
- Log de sincronização com timestamp
- Teste: verifique 5 registros aleatórios
```

---

### 24. Pipeline de Dados
```
Crie pipeline automático:
1. Extraia dados de [API fonte] com filtro: [critério]
2. Transforme: [regras de transformação]
3. Carregue em [destino API]
4. Verifique sucesso: [validações]
5. Se erro: [ação: retry, notifique, quarentena]
Escadule para [frequência]
```
**Exemplo:**
```
Crie pipeline de vendas:
1. Extraia pedidos de Shopify (últimas 24h)
2. Transforme: converta valores BRL→USD, calcule impostos
3. Carregue em sistema contábil via API
4. Verifique: total = soma dos itens, sem duplicatas
5. Se erro: retry 3x, depois notifique contador
Escadule para diariamente às 23:00
```

---

### 25. Webhook Automático
```
Configure webhook de [evento em Sistema A]:
- Quando [evento] → POST para [URL endpoint]
- Payload: [campos relevantes]
- Sistema B processa automaticamente
- Retry em caso de falha: [número de tentativas]
- Log de webhooks
```
**Exemplo:**
```
Configure webhook quando novo cliente se registra:
- Quando cliente criado em Shopify → POST para CRM API
- Payload: nome, email, telefone, fonte, data
- CRM cria contato automaticamente
- Retry 5 vezes se falhar
- Log de webhooks com timestamp
```

---

### 26. Autenticação e Refresh Token
```
Configure autenticação automática:
- Método: [OAuth, API key, Bearer token]
- Obtenha token/credencial
- Se expirar: refresh automaticamente
- Armazene securely em [local]
- Log de tentativas de autenticação
```
**Exemplo:**
```
Configure autenticação Gmail API:
- Método: OAuth 2.0
- Escopo: ler emails, enviar emails
- Se token expirar: refresh automaticamente
- Armazene em variável de ambiente (não em código)
- Log de auth attempts para auditoria
```

---

### 27. Rate Limiting e Retry
```
Ao chamar [API]:
- Respeite rate limit: [chamadas por minuto]
- Se limite atingido: aguarde antes de próxima chamada
- Se erro 429 ou 503: retry com backoff exponencial
- Timeout: [segundos]
- Log de rate limits atingidos
```
**Exemplo:**
```
Ao chamar API do Twitter:
- Respeite: 450 requests/15 min
- Se limite: aguarde automaticamente
- Se erro 503: retry com 1s, 2s, 4s, 8s delay
- Timeout: 30 segundos
- Alerte se rate limit atingido múltiplas vezes
```

---

### 28. Transformação de Dados Complexa
```
Receba dados de [API]:
- Parse JSON/XML
- Extraia campos: [lista]
- Aplique transformações: [regras complexas]
- Validação de schema
- Mapeie para [formato destino]
- Salve/envie para [destino]
```
**Exemplo:**
```
Receba dados de API de câmbio:
- Parse JSON de resposta
- Extraia: moedas, taxa, timestamp
- Aplique: multiplique por margem, calcule variação
- Valide: taxa > 0, moedas válidas
- Mapeie para formato de planilha
- Salve em Google Sheets
```

---

### 29. Monitoramento de Saúde de API
```
Monitore [API/endpoint]:
- Teste a cada [frequência] com chamada [tipo]
- Se resposta tempo > [ms]: alerte
- Se erro HTTP != 200: log detalhado
- Uptime report: [diário/semanal]
- Dashboard de status
```
**Exemplo:**
```
Monitore API principal da empresa:
- Teste a cada 5 minutos com GET /health
- Se resposta > 2000ms: alerte no Slack
- Se erro: log com timestamp, response, stack trace
- Relatório semanal de uptime
- Dashboard público de status
```

---

### 30. Caching de Respostas de API
```
Para [API cara/lenta]:
- Cache respostas por [tempo]
- Se cache expirado: busque dados novos
- Se API indisponível: use cache antigo
- Invalide cache se: [critério]
- Métricas: taxa de cache hit
```
**Exemplo:**
```
Para API de dados de mercado (cara):
- Cache respostas por 1 hora
- Se expirado: busque dados novos
- Se API falhar: use último cache disponível
- Invalide se data > 1 dia
- Mostre % de cache hits no dashboard
```

---

### 31. Tratamento de Erros e Fallback
```
Ao chamar [API principal]:
- Se sucesso: use resposta
- Se erro: tente [API alternativa 1]
- Se erro: tente [API alternativa 2]
- Se todas falharem: use valor padrão/cache
- Notifique: qual API falhou
```
**Exemplo:**
```
Ao buscar taxa de câmbio:
- Se sucesso em API1: use resposta
- Se erro: tente API2 (backup)
- Se erro: tente API3 (fallback)
- Se todas falhem: use taxa de ontem
- Notifique time se redundância necessária
```

---

### 32. Batching de Requisições
```
Para múltiplas [operações]:
- Agrupe em batches de [número]
- Uma chamada API por batch
- Processe respostas em paralelo onde possível
- Mantém performance e respeita rate limits
- Log: número de batches, tempo total
```
**Exemplo:**
```
Para sincronizar 1.000 contatos:
- Agrupe em batches de 100
- Uma chamada POST /batch por grupo
- Processe 3 batches em paralelo
- Mantém velocidade sem exceder rate limit
- Log: 10 batches processados, tempo = 45s
```

---

## ⏰ Cron Jobs e Tarefas Agendadas (10 prompts)

### 33. Cron Job Simples
```
Escadule [ação] para:
- Frequência: [cron expression ou padrão simples]
- Exemplos: diariamente às [hora], toda [dia da semana], mensalmente
- Fuso horário: [fuso]
- Histórico: mantenha log das execuções
- Notifique em caso de falha
```
**Exemplo:**
```
Escadule envio de relatório para:
- Frequência: 0 8 * * MON (segunda-feira 08:00)
- Fuso horário: America/Sao_Paulo
- Histórico: mantenha log
- Notifique gerente se falhar
```

---

### 34. Backup Automático
```
Crie backup automático:
- Frequência: [diária/semanal/mensal]
- Fonte: [o que fazer backup]
- Destino: [onde armazenar]
- Retenção: manter [número] backups recentes
- Verificação: teste restauração periodicamente
```
**Exemplo:**
```
Crie backup automático de banco:
- Frequência: diariamente às 02:00
- Fonte: banco PostgreSQL produção
- Destino: AWS S3 com criptografia
- Retenção: manter 30 dias
- Teste: restaure amostra 1x semana
```

---

### 35. Limpeza de Arquivos
```
Limpe automaticamente:
- Diretório: [caminho]
- Critério: [arquivos com mais de X dias] ou [padrão de nome]
- Ação: [deletar, arquivar, mover para pasta]
- Frequência: [quando executar]
- Notifique: [quanto deletado]
```
**Exemplo:**
```
Limpe automaticamente cache:
- Diretório: /tmp/cache
- Critério: arquivos com mais de 7 dias
- Ação: deletar
- Frequência: diariamente às 03:00
- Notifique: deletou X MB
```

---

### 36. Geração de Relatório
```
Gere relatório automaticamente:
- Frequência: [quando]
- Dados: [o que incluir]
- Formato: [PDF, Excel, HTML]
- Destinatário: [email/arquivo]
- Conteúdo: [tabelas, gráficos, resumo]
```
**Exemplo:**
```
Gere relatório de vendas:
- Frequência: toda sexta-feira às 17:00
- Dados: vendas do mês, top produtos, comparativa
- Formato: PDF com logos
- Destinatário: vendas@empresa.com
- Inclua: tabela, gráficos, resumo executivo
```

---

### 37. Sincronização Periódica
```
Sincronize [sistema A] com [sistema B]:
- Frequência: [periodicidade]
- Campos sincronizados: [lista]
- Resolve conflitos: [estratégia]
- Validação pós-sync: [verificações]
- Relatório: [resume mudanças]
```
**Exemplo:**
```
Sincronize contatos Outlook ↔ Salesforce:
- Frequência: 4x por dia
- Campos: nome, email, telefone, empresa
- Conflito: Salesforce é fonte de verdade
- Validação: 100 contatos aleatórios
- Relatório: X sincronizados, Y conflitos resolvidos
```

---

### 38. Verificação de Saúde do Sistema
```
A cada [frequência], verifique:
- [Métrica 1]: [alerta se > X]
- [Métrica 2]: [alerta se < X]
- [Métrica 3]: [alerta se mudança > X%]
- Se problema: notifique [pessoa] via [canal]
- Histórico: mantenha gráfico de tendências
```
**Exemplo:**
```
A cada 5 minutos, verifique servidor:
- CPU: alerta se > 80%
- Memória: alerta se < 100MB livre
- Disco: alerta se mudança > 1GB/hora
- Se problema: Slack para #ops
- Histórico: dashboard com gráficos
```

---

### 39. Renovação de Licenças/Certificados
```
Monitore expiração de [certificados/licenças]:
- Frequência: diária
- Se expira em [dias]: alerta progressivo
- [dias] antes: notificação soft
- [dias] antes: notificação hard
- [dia anterior]: escalate para gerente
- Se expirou: alerta crítica
```
**Exemplo:**
```
Monitore certificado SSL:
- Frequência: diária
- Se expira em 30 dias: email de aviso
- Se expira em 14 dias: Slack diário
- Se expira em 7 dias: escalate para CTO
- Se expirou: alerta crítica + tente renovar
```

---

### 40. Auditoria e Logging
```
Log automático de [eventos]:
- O quê: [tipos de evento]
- Quando: [frequência de coleta]
- Onde: [arquivo de log / banco de dados]
- Retenção: [quanto tempo manter]
- Análise: [relatório semanal de atividades]
```
**Exemplo:**
```
Log automático de acessos:
- Evento: login/logout, ações administrativas
- Coleta: real-time
- Armazene: banco de dados em nuvem
- Retenção: 1 ano
- Relatório: semanal mostrando acessos suspeitos
```

---

### 41. Warm-up e Otimização
```
Antes de picos de tráfego, execute:
- Cache warming: [critério de dados]
- Escalabilidade: [aumentar recursos se previsto]
- Verificações: [testes de performance]
- Notificação: [time preparado]
```
**Exemplo:**
```
Antes de Black Friday (às 23:00 de terça):
- Cache warming: products, bestsellers, reviews
- Escalabilidade: +50% servidores
- Testes: simule 10x tráfego normal
- Notifique: ops em standby
```

---

### 42. Agregação de Dados
```
Agregue dados de múltiplas [fontes]:
- Frequência: [quando]
- Coleta de: [listagem de fontes]
- Consolidação: [regras de merge]
- Armazenamento: [onde salvar]
- Relatório: [que gerar com dados agregados]
```
**Exemplo:**
```
Agregue métricas de performance:
- Frequência: 1x ao dia às 07:00
- Fontes: Google Analytics, Hotjar, APM, logs
- Consolidação: média por período
- Armazenamento: data warehouse
- Relatório: dashboard executivo
```

---

## 🔗 Workflows Complexos Multi-Step (8 prompts)

### 43. Workflow de Aprovação
```
Crie workflow para [processo]:
Passo 1: [pessoa/grupo] submete [informação]
Passo 2: [revisor] aprova/rejeita com [feedback]
Se rejeita → volta pro submissor
Se aprova → Passo 3: [ação automática]
Passo 4: [notificação/arquivo]
Timeout: [se não aprovado em X dias, escalar]
```
**Exemplo:**
```
Workflow de aprovação de despesa:
P1: Funcionário submete recibo + categoria + valor
P2: Gerente aprova/rejeita com motivo
Se rejeita → volta
Se aprova → P3: gera boleto/transferência
P4: notifica RH + arquivo
Timeout: 7 dias → escalate para diretor
```

---

### 44. Workflow de Onboarding
```
Quando [novo evento]:
Dia 0: [tarefa 1], [tarefa 2], [tarefa 3]
Dia 1: [tarefa 4], [tarefa 5]
Dia 7: [tarefa 6], [tarefa 7]
Dia 30: [revisão], [feedback]
Automático: envia emails, notificações, cria tarefas
Dependências: [atividade B só se A completa]
```
**Exemplo:**
```
Workflow de onboarding de cliente:
D0: envia boas-vindas, cria conta, ativa API
D1: tutorial de setup, webinar introdutório
D7: check-in de progresso, resolve dúvidas
D30: revisão, feedback, upgrade de plano
Automático: emails programados
Dependência: webinar só se conta criada
```

---

### 45. Workflow Condicional
```
Quando [evento]:
Se [condição A]: execute [fluxo A]
Senão se [condição B]: execute [fluxo B]
Senão: execute [fluxo padrão]
Cada passo tem: [timeout, notificação, log]
Paralelo onde possível para performar
```
**Exemplo:**
```
Quando novo pedido chega:
Se valor < R$ 500: fulfillment automático
Se valor R$ 500-2k: aprovação gerente
Se valor > R$ 2k: aprovação diretor + contato
Timeout: 4h, 8h, 24h respectivamente
Logs: rastreie cada pedido
Paralelo: processe múltiplos pedidos
```

---

### 46. Workflow de Notificação Escalonada
```
Quando [problema/alerta]:
T+0: notifique [pessoa 1] via [canal 1]
T+15min: se sem resposta, notifique [pessoa 2]
T+30min: se sem resposta, notifique [pessoa 3]
T+60min: se sem resposta, escalate
Rastreamento: log de tentativas e respostas
```
**Exemplo:**
```
Quando API fica offline:
T+0: notifique #ops no Slack
T+15min: SMS para on-call engineer
T+30min: ligação para lead engineer
T+60min: email para diretor de tech
Log: quem respondeu, quando, tempo total
```

---

### 47. Workflow com Dados Humanos
```
Quando [tarefa automatizável mas precisa input]:
Notifique [pessoa responsável]
Espere [tempo máximo] por resposta
Se não responder: [ação padrão ou escalate]
Se responder: processe resposta + continue workflow
Log: tempo de resposta, decisões
```
**Exemplo:**
```
Quando lead novo chega:
Notifique sales person: "novo lead relevante"
Espere 24h por feedback de interest
Se ignorar: envie email de follow-up
Se responder: crie opportunity no CRM
Log: quem respondeu em quanto tempo
```

---

### 48. Workflow de Error Recovery
```
Quando [etapa do workflow] falha:
Retry 1: [após X segundos]
Retry 2: [após Y segundos]
Retry 3: [após Z segundos]
Se ainda falhar: [ação alternativa ou manual]
Notifique: [pessoa responsável]
Log: todas as tentativas e motivos
```
**Exemplo:**
```
Quando sincronização API falha:
Retry 1: após 30 segundos
Retry 2: após 5 minutos
Retry 3: após 30 minutos
Se falhar: use cache + notifique eng
Notifique: #tech-alerts
Log: todos os erros para diagnóstico
```

---

### 49. Workflow com Verificação de Qualidade
```
Após [processo], execute:
Verificação 1: [validação A]
Verificação 2: [validação B]
Se alguma falhar: [log do erro, ação de correção]
Se todas passarem: [marque como completo]
Relatório: [taxa de sucesso, problemas recorrentes]
```
**Exemplo:**
```
Após sincronização de contatos:
V1: validar email não duplicado
V2: validar telefone em formato correto
Se falha: quarentena + notifique
Se sucesso: ativa contato no CRM
Relatório: 98% de sucesso, 2% duplicatas
```

---

### 50. Workflow de Auditoria
```
Para [processo sensível/crítico]:
Registre: quem, quando, o quê, por quê
Antes: captura estado anterior
Depois: captura estado novo
Diferença: log apenas o que mudou
Auditoria: relatório mensal de mudanças
Compliance: pronto para verificação regulatória
```
**Exemplo:**
```
Para mudança de acesso de usuário:
Registre: quem removeu access, quando, qual acesso, motivo
Antes: lista permissões antigas
Depois: lista novas permissões
Diferença: X permissões removidas
Auditoria: relatório semanal de mudanças
Compliance: pronto para SOC2 audit
```

---

## 💡 Dicas Avançadas

1. **Teste em Sandbox**: Sempre teste workflows complexos em ambiente de teste
2. **Documente**: Mantenha documentação de workflows críticos
3. **Monitore Execução**: Implemente logging e alertas para workflows
4. **Versione**: Mantenha histórico de versões de workflows
5. **Paralelize**: Use processamento paralelo quando seguro

---

## 🔗 Próximos Passos

- [Voltar para Produtividade](prompts-openclaw-produtividade.md)
- [Explorar Skills da Comunidade](openclaw-melhores-skills-comunidade.md)
- [Aprender Desenvolvimento de Skills](openclaw-api-desenvolvimento-skills.md)

---

*Última atualização: 24 de fevereiro de 2026*
*Versão: 1.0*
