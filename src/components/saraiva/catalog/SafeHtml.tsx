import type { ReactNode } from "react";

type SafeBlockKind = "heading" | "paragraph" | "quote" | "listItem";

interface SafeBlock {
  kind: SafeBlockKind;
  text: string;
}

function decodeEntities(value: string) {
  function decodeCodePoint(code: string, radix: number) {
    const value = Number.parseInt(code, radix);
    return Number.isInteger(value) && value >= 0 && value <= 0x10ffff
      ? String.fromCodePoint(value)
      : "�";
  }

  return value
    .replace(/&#(\d+);/g, (_, code: string) => decodeCodePoint(code, 10))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      decodeCodePoint(code, 16),
    )
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function textOnly(value: string) {
  return decodeEntities(
    value
      .replace(/<!--([\s\S]*?)-->/g, "")
      .replace(
        /<\s*(script|style|iframe|object|embed|svg|form|button|input|select|textarea|template|noscript)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
        "",
      )
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

function parseSafeBlocks(html: string) {
  const blocks: SafeBlock[] = [];
  const blockPattern =
    /<(h[1-5]|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;

  for (const match of html.matchAll(blockPattern)) {
    const tagName = match[1].toLowerCase();
    const text = textOnly(match[2]);
    if (!text) {
      continue;
    }

    const kind: SafeBlockKind = tagName.startsWith("h")
      ? "heading"
      : tagName === "li"
        ? "listItem"
        : tagName === "blockquote"
          ? "quote"
          : "paragraph";
    blocks.push({ kind, text });
  }

  if (blocks.length === 0) {
    const text = textOnly(html);
    if (text) {
      blocks.push({ kind: "paragraph", text });
    }
  }

  return blocks;
}

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const blocks = parseSafeBlocks(html);
  const content: ReactNode[] = [];
  let listItems: SafeBlock[] = [];

  function flushList() {
    if (listItems.length === 0) {
      return;
    }

    content.push(
      <ul key={`list-${content.length}`}>
        {listItems.map((item, index) => (
          <li key={`item-${index}`}>{item.text}</li>
        ))}
      </ul>,
    );
    listItems = [];
  }

  blocks.forEach((block, index) => {
    if (block.kind === "listItem") {
      listItems.push(block);
      return;
    }

    flushList();

    if (block.kind === "heading") {
      content.push(<h2 key={`heading-${index}`}>{block.text}</h2>);
      return;
    }

    if (block.kind === "quote") {
      content.push(
        <blockquote key={`quote-${index}`}>{block.text}</blockquote>,
      );
      return;
    }

    content.push(<p key={`paragraph-${index}`}>{block.text}</p>);
  });

  flushList();

  return <div className={className}>{content}</div>;
}
