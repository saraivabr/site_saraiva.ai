import type { Env, SourceItem, GeneratedArticle, ContentCategory } from './types';

const SYSTEM_PROMPT = `Você é um jornalista especializado em IA e tecnologia, escrevendo para empreendedores e criadores brasileiros.

Regras:
- Escreva em português do Brasil, tom direto e prático
- 600-1200 palavras
- Use H2 (##) e H3 (###) para estruturar
- Inclua exemplos práticos e insights acionáveis
- Termine com uma seção "O que fazer agora" com 2-3 ações concretas
- NÃO use emojis no corpo do texto
- NÃO invente dados - baseie-se na fonte fornecida
- Retorne APENAS o conteúdo em JSON (sem markdown, sem code block)`;

function buildPrompt(item: SourceItem, category: ContentCategory): string {
  const categoryInstructions: Record<ContentCategory, string> = {
    tool: 'Escreva um review da ferramenta. Estrutura: O que é > Funcionalidades > Pricing > Prós > Contras > Veredicto. Inclua "pricing" (Free/Freemium/Paid).',
    prompt: 'Escreva um artigo com templates de prompts prontos para uso. Inclua os prompts formatados em blocos de código markdown.',
    analysis: 'Escreva uma análise com dados e contexto do mercado. Use dados concretos quando disponíveis.',
    thought: 'Escreva um artigo de opinião/reflexão. Tom pessoal e provocativo.',
  };

  return `Tema: "${item.title}"
Fonte: ${item.url}
Descrição: ${item.description}
Data: ${item.date}

Categoria: ${category}
Instrução: ${categoryInstructions[category]}

Retorne um JSON válido (sem code block, sem markdown wrapper) com esta estrutura:
{
  "title": "título em português",
  "description": "descrição curta de 1-2 frases",
  "body": "conteúdo completo em markdown",
  "tags": ["tag1", "tag2", "tag3"],
  "pricing": "Free" | "Freemium" | "Paid" | null,
  "featured": false
}`;
}

export async function generateArticle(
  sourceItem: SourceItem,
  category: ContentCategory,
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

    return parseJsonResponse(text, sourceItem, category);
  } catch (err) {
    console.error('Content generation failed:', err);
    return null;
  }
}

function parseJsonResponse(
  text: string,
  sourceItem: SourceItem,
  category: ContentCategory
): GeneratedArticle | null {
  try {
    // Clean up the response - remove code block markers if present
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned) as {
      title?: string;
      description?: string;
      body?: string;
      tags?: string[];
      pricing?: string;
      featured?: boolean;
    };

    return {
      title: parsed.title || sourceItem.title,
      slug: slugify(parsed.title || sourceItem.title),
      category,
      description: parsed.description || sourceItem.description,
      tags: parsed.tags || [],
      body: parsed.body || '',
      sourceUrl: sourceItem.url,
      pricing: (['Free', 'Freemium', 'Paid'].includes(parsed.pricing || '') ? parsed.pricing : null) as GeneratedArticle['pricing'],
      image_url: null,
      featured: parsed.featured ?? false,
    };
  } catch (err) {
    console.error('JSON parse failed, trying fallback:', err);
    // Fallback: treat the entire text as body content
    return {
      title: sourceItem.title,
      slug: slugify(sourceItem.title),
      category,
      description: sourceItem.description,
      tags: [],
      body: text,
      sourceUrl: sourceItem.url,
      pricing: null,
      image_url: null,
      featured: false,
    };
  }
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
