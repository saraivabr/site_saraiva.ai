import type { Env, SourceItem, GeneratedArticle, Category } from './types';

const SYSTEM_PROMPT = `Você é um jornalista especializado em IA e tecnologia, escrevendo para empreendedores brasileiros.

Regras:
- Escreva em português do Brasil, tom direto e prático
- 800-1500 palavras
- Use H2 (##) e H3 (###) para estruturar
- Inclua exemplos práticos e actionable insights
- Termine com uma seção "O que fazer agora" com 2-3 ações concretas
- NÃO use emojis
- NÃO invente dados - baseie-se na fonte fornecida
- Gere um frontmatter YAML completo no início`;

export async function generateArticle(
  sourceItem: SourceItem,
  category: Category,
  env: Env
): Promise<GeneratedArticle | null> {
  try {
    const userPrompt = buildPrompt(sourceItem, category);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      console.error('Claude API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>;
    };
    const text = data.content[0]?.text;
    if (!text) return null;

    return parseGeneratedContent(text, sourceItem, category);
  } catch (err) {
    console.error('Content generation failed:', err);
    return null;
  }
}

function buildPrompt(item: SourceItem, category: Category): string {
  const categoryInstructions: Record<Category, string> = {
    blog: 'Escreva um artigo de notícia/análise sobre este tema.',
    tutoriais: 'Escreva um tutorial passo-a-passo. Inclua "difficulty" no frontmatter (iniciante/intermediario/avancado).',
    ferramentas: 'Escreva um review da ferramenta. Inclua "rating" (1-5) e "pricing" (free/freemium/paid) no frontmatter. Estrutura: O que é > Funcionalidades > Pricing > Prós > Contras > Veredicto.',
    prompts: 'Escreva um artigo com templates de prompts prontos para uso. Inclua os prompts em blocos de código.',
    analises: 'Escreva uma análise profunda com dados e comparações. Use tabelas markdown quando relevante.',
    pensamentos: 'Escreva um artigo de opinião/reflexão. Tom pessoal e provocativo.',
  };

  return `Tema: "${item.title}"
Fonte: ${item.url}
Descrição: ${item.description}
Data: ${item.date}

Categoria: ${category}
Instrução: ${categoryInstructions[category]}

Gere o artigo completo com frontmatter YAML no início no formato:
---
title: "..."
slug: "..."
category: "${category}"
date: "${new Date().toISOString().split('T')[0]}"
author: "Saraiva"
description: "..."
tags: [...]
image: ""
source: "${item.url}"
featured: false
---

Depois do frontmatter, escreva o artigo completo em markdown.`;
}

function parseGeneratedContent(
  text: string,
  sourceItem: SourceItem,
  category: Category
): GeneratedArticle | null {
  const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const content = frontmatterMatch[2].trim();

  const title = extractYamlValue(frontmatter, 'title') || sourceItem.title;
  const slug = extractYamlValue(frontmatter, 'slug') || slugify(title);
  const description = extractYamlValue(frontmatter, 'description') || sourceItem.description;
  const tagsStr = extractYamlValue(frontmatter, 'tags') || '[]';
  const tags = JSON.parse(tagsStr.replace(/'/g, '"')) as string[];

  const article: GeneratedArticle = {
    title,
    slug,
    category,
    description,
    tags,
    content,
    sourceUrl: sourceItem.url,
  };

  if (category === 'tutoriais') {
    article.difficulty = (extractYamlValue(frontmatter, 'difficulty') as GeneratedArticle['difficulty']) || 'intermediario';
  }
  if (category === 'ferramentas') {
    const ratingStr = extractYamlValue(frontmatter, 'rating');
    article.rating = ratingStr ? parseInt(ratingStr) : 4;
    article.pricing = (extractYamlValue(frontmatter, 'pricing') as GeneratedArticle['pricing']) || 'freemium';
  }

  return article;
}

function extractYamlValue(yaml: string, key: string): string | null {
  const regex = new RegExp(`^${key}:\\s*(?:"([^"]*)"|(\\[.*\\])|(.+))$`, 'm');
  const match = regex.exec(yaml);
  if (!match) return null;
  return match[1] || match[2] || match[3]?.trim() || null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
