---
title: "Como construí um MVP em 3 dias usando o v0 da Vercel"
slug: "review-v0"
category: "ferramentas"
date: "2026-02-22"
author: "Saraiva"
description: "Como usei o v0 da Vercel para criar a interface de um MVP completo em 3 dias — e onde a ferramenta me deixou na mão."
tags: ["v0", "vercel", "frontend"]
image: ""
source: ""
featured: false
rating: 4
pricing: "freemium"
---

# Como construí um MVP em 3 dias usando o v0 da Vercel

O Thiago é desenvolvedor backend. Sólido em Node.js, PostgreSQL, APIs REST. Mas quando precisou criar a interface do MVP da sua startup — um dashboard para gestão de entregas — travou. Ele sabia que o produto funcionava, a API estava pronta, os dados estavam lá. O problema era que ninguém ia investir em algo que parecesse planilha do Excel.

Eu já passei por isso mais vezes do que gostaria de admitir. Você domina a lógica, mas na hora de transformar em algo visual e funcional, empaca. CSS é uma linguagem à parte. Responsividade é um pesadelo. E contratar um front-end para um MVP que ainda não validou? O orçamento não fecha.

## A dor de quem programa mas não faz interface

Essa é uma dor silenciosa no mercado tech brasileiro. Temos uma geração de devs fullstack que são, na verdade, backends com noções de front. Sabem instalar React e Tailwind, mas na hora de criar uma interface que não pareça exercício de bootcamp, a coisa complica.

As alternativas clássicas: templates prontos (ficam genéricos e limitam a customização), Figma + handoff para front (caro e lento), ou ChatGPT gerando código (inconsistente, sem preview, e o código precisa de muito ajuste).

## O que eu tentei antes do v0

Já usei templates de dashboard do Tailwind UI. Funcionam, mas você gasta mais tempo customizando do que teria gasto criando do zero. Já pedi interfaces pro ChatGPT — o código vem razoável, mas sem preview você fica naquele loop de "gerar, copiar, colar, rodar, ver que ficou errado, voltar, pedir de novo". Já tentei o Bolt e o Lovable — bons para apps simples, mas para interfaces mais elaboradas o output é medíocre.

O problema central: nenhuma dessas ferramentas entendia profundamente o ecossistema React + Tailwind + Shadcn ao ponto de gerar código que eu pudesse usar diretamente no meu projeto sem refatorar tudo.

## O v0 entende o ecossistema como ninguém

A virada com o v0 foi perceber que ele não é um "gerador de código genérico" — é uma ferramenta feita pela Vercel, treinada especificamente no ecossistema Next.js + React + Tailwind + Shadcn. O código que ele gera segue as mesmas convenções que eu já uso nos meus projetos. Isso muda tudo.

Eu estava cético quando abri o v0 pela primeira vez. Digitei "crie um dashboard com sidebar de navegação, header com avatar e notificações, e área principal com cards de métricas e um gráfico de linha" e... o resultado era melhor que qualquer interface que eu teria criado em 2 dias de trabalho. Com dark mode, responsivo, e componentizado.

## Na prática: construindo o MVP do Thiago

### Passo 1: A estrutura principal (40 minutos)

**Input:**
```
Dashboard de gestão de entregas com:
- Sidebar com navegação (Entregas, Motoristas, Relatórios, Configurações)
- Header com busca, notificações e avatar do usuário
- Área principal com 4 cards de métricas (entregas hoje, em andamento,
  atrasadas, taxa de sucesso)
- Gráfico de linha mostrando entregas por dia nos últimos 30 dias
- Tabela de entregas recentes com status, motorista, endereço e horário
```

**Output:** Um dashboard completo, responsivo, com Shadcn UI, Recharts para o gráfico, Lucide Icons, dark mode toggle. O TypeScript estava tipado corretamente. A sidebar colapsava em mobile. Os cards tinham ícones e indicadores de variação percentual.

**Tempo que levaria manualmente:** 10-15 horas.

**Por que importa:** O v0 não gerou código genérico. Ele gerou exatamente o que eu usaria num projeto Next.js real, com as bibliotecas que eu já conheço.

### Passo 2: Iteração por conversação (2 horas)

Aqui é onde o v0 realmente brilha. Em vez de editar CSS manualmente, eu conversava:

- "Mude os cards para tons de azul e verde em vez de roxo"
- "Adicione paginação na tabela com 10 itens por página"
- "O gráfico precisa de tooltip ao passar o mouse mostrando o valor exato"
- "Adicione um filtro de data acima da tabela"

Cada pedido era aplicado em segundos, com preview instantânea. Eu via o resultado ao vivo e ajustava. O ciclo de feedback que normalmente leva minutos (editar, salvar, recarregar, verificar) caiu para segundos.

**Input de refinamento:**
```
Adicione uma visão de mapa mostrando as entregas em andamento como pins.
Use um placeholder de mapa com os pins posicionados aleatoriamente.
Coloque um toggle para alternar entre visão de tabela e visão de mapa.
```

**Output:** Uma aba de mapa com pins estilizados, toggle animado, e a transição entre tabela e mapa com animação suave. O código era limpo e componentizado.

### Passo 3: Telas secundárias (3 horas)

Gerei as outras telas do MVP da mesma forma:

- **Página de Motoristas:** tabela com foto, nome, status, entregas do dia, avaliação. Filtros por status.
- **Formulário de Nova Entrega:** campos com validação visual, seletor de motorista, mapa para endereço.
- **Página de Relatórios:** gráficos de barra (entregas por motorista), pizza (status de entregas), linha (evolução mensal).

Cada tela levou 30-60 minutos incluindo iterações. No total, 5 telas completas em um dia.

### Passo 4: Exportação e integração (meio dia)

O código saiu do v0 com `npx shadcn init` e importação direta dos componentes. Precisei ajustar:

- Conectar aos dados reais da API (o v0 gerou com dados mock)
- Adicionar gerenciamento de estado para filtros e paginação
- Implementar autenticação real (o v0 gera o layout, não a lógica)
- Ajustar 2-3 detalhes de responsividade que não ficaram perfeitos

**Tempo de ajuste: 1.5 dias** para conectar tudo à API real e polir.

## Onde brilha

- **Prototipagem absurdamente rápida.** O que levaria 2 semanas levou 3 dias. Não é marketing — é o que eu vivi.
- **Código nativo do ecossistema.** React + TypeScript + Tailwind + Shadcn. Não precisa traduzir de um framework para outro.
- **Iteração por conversa é viciante.** Pedir ajustes em linguagem natural e ver o resultado em tempo real muda o fluxo de trabalho.
- **Preview instantânea.** Elimina o loop de copiar/colar/rodar. Você vê o que está gerando.
- **Bom para aprender.** Se você está aprendendo React e Tailwind, o código gerado pelo v0 é material didático de qualidade.
- **Plano Free generoso.** 200 mensagens por mês dá para construir um MVP inteiro.

## Onde tropeça

- **Preso no ecossistema React + Tailwind.** Vue, Angular, Svelte, CSS-in-JS? Esquece. O v0 é Vercel e só fala Vercel.
- **Lógica de negócio é superficial.** Formulários com validação real, integração com APIs, gerenciamento de estado complexo — tudo isso você faz na mão.
- **Não substitui um designer.** O v0 gera interfaces "bonitas genéricas". Se você precisa de identidade visual única, originalidade de marca, ele não entrega.
- **Dependência forte do Shadcn.** 95% do output usa componentes Shadcn. Se seu projeto usa outra biblioteca de componentes, o código precisa de adaptação significativa.
- **Responsividade nem sempre é perfeita.** Em 3 das 5 telas do MVP, precisei ajustar breakpoints manualmente. O mobile-first não é tão first assim.
- **Para design systems maduros, atrapalha mais do que ajuda.** Se sua empresa tem componentes próprios com convenções específicas, o código gerado conflita com o que já existe.

## O resultado: antes e depois

**Antes do v0:**
- 2-3 semanas para interface de MVP (dev backend fazendo front)
- Templates genéricos ou interfaces "feias mas funcionais"
- Frustração constante com CSS e responsividade
- Ou R$ 5-8 mil para contratar um front-end freelancer

**Depois do v0:**
- 3 dias para 5 telas completas, responsivas, com dark mode
- Interface com qualidade visual profissional
- Código limpo que integrou direto no projeto Next.js
- R$ 0 (fiz tudo no plano Free)

O Thiago apresentou o MVP para investidores na semana seguinte. A interface passou no "teste do olhômetro" — ninguém perguntou se era protótipo. Dois investidores pediram acesso beta.

### Custos em BRL (cotação fev/2026)

| Plano | Preço | O que inclui |
|-------|-------|--------------|
| Free | R$ 0 | 200 mensagens/mês, gerações básicas |
| Premium | ~R$ 110/mês | 5.000 mensagens/mês, modelos avançados, prioridade |
| Team | ~R$ 165/usuário/mês | Premium + colaboração, workspace compartilhado |

## O que se abre a partir daqui

O v0 não vai substituir desenvolvedores front-end — pelo menos não os bons. O que ele faz é eliminar a barreira entre "ter a ideia" e "ver a ideia funcionando". Para backends que precisam de interface, para startups validando MVPs, para freelancers que precisam entregar rápido, ele comprime semanas em dias.

A combinação que eu recomendo: v0 para gerar a estrutura visual, Cursor ou Claude para refinar a lógica e integrar com a API. Juntos, cobrem 90% do que um dev solo precisa para lançar um produto.

O Thiago hoje usa o v0 para prototipar toda feature nova antes de implementar. Ele diz que é como ter um front-end junior disponível 24 horas que trabalha em segundos. Não é perfeito — mas é rápido, barato, e bom o suficiente para validar ideias antes de investir tempo de desenvolvimento real.

Se você trabalha com React e Tailwind, teste com o plano Free. Descreva a interface mais complexa que você precisa construir e veja o que sai. Na minha experiência, o resultado vai te surpreender — e os ajustes que você vai precisar fazer são muito menores do que o trabalho de criar do zero.
