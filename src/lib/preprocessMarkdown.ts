/**
 * Preprocessa texto semi-formatado em Markdown adequado.
 * Detecta headings, listas e seções que foram escritas sem sintaxe Markdown.
 */
export function preprocessMarkdown(raw: string): string {
  const lines = raw.split("\n");
  const result: string[] = [];

  // Patterns que indicam headings (linhas curtas, sem pontuação final, seguidas de conteúdo)
  const headingPatterns = [
    /^#{1,6}\s/, // Já é heading markdown
  ];

  const emojiSectionPattern = /^[\p{Emoji_Presentation}\p{Emoji}\u200d]+\s*.+/u;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Linha vazia — manter
    if (!trimmed) {
      result.push("");
      continue;
    }

    // Já é heading markdown — manter
    if (/^#{1,6}\s/.test(trimmed)) {
      result.push(line);
      continue;
    }

    // Já é list item — manter
    if (/^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      result.push(line);
      continue;
    }

    // Já é tabela — manter
    if (trimmed.startsWith("|")) {
      result.push(line);
      continue;
    }

    // Emoji section header (ex: "💰 Oportunidades de Monetização", "💕 Para Quem É Ideal")
    if (emojiSectionPattern.test(trimmed) && trimmed.length < 60 && !trimmed.endsWith(".")) {
      result.push("");
      result.push(`## ${trimmed}`);
      continue;
    }

    // Detectar heading: linha curta, sem pontuação final, não bold, parece título
    const isShort = trimmed.length <= 50;
    const noEndPunctuation = !/[.,:;!?)…]$/.test(trimmed);
    const looksLikeTitle = /^[A-ZÀ-ÚÇ\d]/.test(trimmed); // Começa com maiúscula
    const notBoldInline = !trimmed.startsWith("**"); // Não é bold inline (lista formatada)
    const hasMultipleWords = trimmed.split(/\s+/).length >= 2;

    // Olhar contexto: próxima linha não vazia
    let nextNonEmpty = "";
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim()) {
        nextNonEmpty = lines[j].trim();
        break;
      }
    }

    // Linha anterior não vazia
    let prevNonEmpty = "";
    for (let j = i - 1; j >= 0; j--) {
      if (lines[j].trim()) {
        prevNonEmpty = lines[j].trim();
        break;
      }
    }

    const nextIsContent = nextNonEmpty.length > trimmed.length || /^[-*\d|]/.test(nextNonEmpty) || /^\*\*/.test(nextNonEmpty);
    const prevIsEmptyOrHeading = !prevNonEmpty || /^#{1,6}\s/.test(prevNonEmpty) || result[result.length - 1]?.trim() === "";

    if (isShort && noEndPunctuation && looksLikeTitle && notBoldInline && hasMultipleWords && nextIsContent) {
      // Determinar nível: se parece sub-seção (dentro de seção maior), usar ###
      const lastHeadingLevel = getLastHeadingLevel(result);
      const level = lastHeadingLevel >= 2 ? "###" : "##";
      result.push("");
      result.push(`${level} ${trimmed}`);
      continue;
    }

    // Linhas que começam com bold (ex: "**Ad banners** para Facebook") — converter em list item
    if (/^\*\*[^*]+\*\*\s/.test(trimmed)) {
      result.push(`- ${trimmed}`);
      continue;
    }

    // Texto normal
    result.push(line);
  }

  return result.join("\n");
}

function getLastHeadingLevel(lines: string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    const match = lines[i].match(/^(#{1,6})\s/);
    if (match) return match[1].length;
  }
  return 0;
}
