import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface ArticleRendererProps {
  content: string;
}

const ArticleRenderer = ({ content }: ArticleRendererProps) => {
  return (
    <div className="
      prose prose-sm sm:prose-base max-w-none

      prose-headings:font-sans prose-headings:font-black prose-headings:tracking-tight prose-headings:text-black

      prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:mt-12 prose-h1:mb-6
      prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-black/[0.06]
      prose-h3:text-base prose-h3:sm:text-lg prose-h3:mt-8 prose-h3:mb-4

      prose-p:font-mono prose-p:text-[13px] prose-p:sm:text-sm prose-p:leading-[1.8] prose-p:text-black/70

      prose-a:text-black prose-a:font-bold prose-a:underline prose-a:underline-offset-4 prose-a:decoration-black/20 hover:prose-a:decoration-black/60

      prose-strong:text-black prose-strong:font-bold

      prose-ul:font-mono prose-ul:text-[13px] prose-ul:sm:text-sm
      prose-ol:font-mono prose-ol:text-[13px] prose-ol:sm:text-sm
      prose-li:text-black/70 prose-li:leading-[1.8] prose-li:marker:text-black/30

      prose-blockquote:border-l-2 prose-blockquote:border-black prose-blockquote:bg-black/[0.02] prose-blockquote:py-3 prose-blockquote:px-6
      prose-blockquote:font-mono prose-blockquote:text-[13px] prose-blockquote:text-black/60 prose-blockquote:not-italic

      prose-code:font-mono prose-code:text-xs prose-code:bg-black/[0.06] prose-code:text-black/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none

      prose-pre:bg-[#0a0a0a] prose-pre:text-white/90 prose-pre:font-mono prose-pre:text-xs prose-pre:leading-relaxed prose-pre:rounded-none prose-pre:border prose-pre:border-black/10 prose-pre:overflow-x-auto

      prose-img:rounded-none prose-img:border prose-img:border-black/10

      prose-table:font-mono prose-table:text-xs prose-table:sm:text-sm
      prose-thead:border-b-2 prose-thead:border-black/20
      prose-th:font-bold prose-th:text-left prose-th:py-3 prose-th:px-3 prose-th:bg-black/[0.03]
      prose-td:py-3 prose-td:px-3 prose-td:border-b prose-td:border-black/[0.06]

      prose-hr:border-black/10 prose-hr:my-10
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ArticleRenderer;
