import "server-only";

import type { Article } from "@/components/saraiva/catalog/data";

export const OWNED_ARTICLE_SLUG = "o-gargalo-saiu-da-lista";

export const ownedArticlePilot: Article = {
  id: "8f60d3ac-7aba-4cc6-8ff4-830675c8d8a2",
  slug: OWNED_ARTICLE_SLUG,
  title: "O gargalo saiu da lista",
  summary: "Prospecção com IA acelerou o topo do funil. O custo agora aparece no intervalo entre a resposta do lead e o primeiro atendimento útil.",
  image_url: "/images/news/pilots/tempo-de-resposta-saraiva-v1.png",
  author: "Fellipe Saraiva",
  source_name: "Saraiva.AI",
  source_system: "saraiva-owned",
  published_at: "2026-08-12T23:50:00.000Z",
  story_content: null,
  content_text: `## A lista deixou de ser a parte difícil

Hoje já é possível transformar uma descrição de cliente ideal em uma lista organizada por setor, cargo, sinais de crescimento e aderência. Isso reduz trabalho manual, mas não garante que a conversa avance.

O problema aparece no minuto seguinte: alguém responde e a operação não percebe, encaminha para a pessoa errada ou demora tanto que o contexto esfria. Uma lista melhor não corrige uma resposta tardia.

## O relógio começa quando o lead responde

O indicador mais útil não é quantos contatos entraram. É quanto tempo passa entre a primeira mensagem recebida e a primeira resposta útil enviada.

No motor-go, essa definição já existe de forma explícita: o tempo de resposta começa na primeira mensagem recebida de um turno e termina na primeira mensagem enviada depois dela. A medição vale para conversas individuais e evita misturar grupos, ruído ou atividade sem relação comercial.

Essa precisão muda a discussão. Em vez de perguntar se a equipe está ocupada, você consegue perguntar onde uma intenção real ficou esperando.

## Quatro peças para não perder o momento

1. **Um lugar só para os retornos.** Cada resposta precisa virar registro com origem, horário e responsável. O domínio crm.leads do motor-go preserva o workspace e a origem de importação para que contatos não virem uma lista solta.
2. **Intenção antes de entusiasmo.** “Quanto custa?”, “quero ver” e “manda material” não representam o mesmo estágio. A prioridade deve vir do que a pessoa declarou e do contexto disponível, não de uma impressão genérica.
3. **Um prazo com dono.** Defina o tempo esperado para o primeiro atendimento e quem responde quando ele estoura. Sem responsável, o SLA vira decoração.
4. **Continuar em vez de recomeçar.** Quem já respondeu não deveria explicar tudo outra vez. A conversa precisa retomar o histórico, a intenção observada e a próxima ação registrada.

## O que já conseguimos observar

O patrimônio Saraiva.AI já contém contratos para importação e deduplicação de leads, isolamento por workspace, estágios de pipeline, sinais de avanço e medição de tempo de resposta. Também existem testes de ciclo de vida e regras que impedem um contato de pular diretamente para uma etapa final.

Isso prova o mecanismo técnico. Ainda não prova um ganho comercial universal — e eu não vou inventar um número para preencher essa lacuna. O próximo passo correto é medir uma operação real antes e depois de definir o fluxo.

## Um diagnóstico antes de qualquer promessa

Em vinte minutos, a gente mapeia de onde chegam as respostas, onde elas ficam esperando, quem assume cada conversa e qual dado falta para medir o primeiro atendimento.

O diagnóstico é gratuito e não obriga você a contratar nada. Se o gargalo estiver em oferta, preço ou qualificação — e não em velocidade — eu vou dizer isso com clareza.`,
  url: "",
};
