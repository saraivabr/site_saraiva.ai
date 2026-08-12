import type { ReactNode } from "react";

function inlineMarkdown(text: string): ReactNode[] {
  const fragments = text.split(/(\*\*[^*]+\*\*)/g);
  return fragments.map((fragment, index) =>
    fragment.startsWith("**") && fragment.endsWith("**") ? (
      <strong key={`${fragment}-${index}`}>{fragment.slice(2, -2)}</strong>
    ) : (
      fragment
    ),
  );
}

export function MarkdownContent({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="space-y-6 text-[17px] leading-8 text-[rgb(55,59,66)]">
      {blocks.map((rawBlock, index) => {
        const block = rawBlock.trim();
        if (block.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-3 text-2xl font-bold tracking-[-0.03em] text-[rgb(18,20,24)]">
              {inlineMarkdown(block.slice(4))}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="pt-6 text-3xl font-bold tracking-[-0.035em] text-[rgb(18,20,24)]">
              {inlineMarkdown(block.slice(3))}
            </h2>
          );
        }
        const lines = block.split("\n");
        if (lines.every((line) => /^[-*] /.test(line))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 marker:text-[#0085FE]">
              {lines.map((line) => <li key={line}>{inlineMarkdown(line.slice(2))}</li>)}
            </ul>
          );
        }
        if (lines.every((line) => /^\d+[.)] /.test(line))) {
          return (
            <ol key={index} className="list-decimal space-y-2 pl-6 marker:font-semibold">
              {lines.map((line) => <li key={line}>{inlineMarkdown(line.replace(/^\d+[.)] /, ""))}</li>)}
            </ol>
          );
        }
        return <p key={index}>{inlineMarkdown(block)}</p>;
      })}
    </div>
  );
}
