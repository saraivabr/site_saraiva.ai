import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface ArticleRendererProps {
  content: string;
}

const ArticleRenderer = ({ content }: ArticleRendererProps) => {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none
      prose-headings:font-mono prose-headings:tracking-tight
      prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-4
      prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
      prose-p:font-mono prose-p:text-sm prose-p:leading-relaxed prose-p:opacity-80
      prose-a:text-black prose-a:underline prose-a:underline-offset-2 hover:prose-a:opacity-70
      prose-strong:font-bold
      prose-ul:font-mono prose-ul:text-sm
      prose-ol:font-mono prose-ol:text-sm
      prose-li:opacity-80
      prose-blockquote:border-l-black prose-blockquote:font-mono prose-blockquote:text-sm prose-blockquote:opacity-70
      prose-code:font-mono prose-code:text-xs prose-code:bg-black/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-black prose-pre:text-white prose-pre:font-mono prose-pre:text-xs
      prose-img:rounded-none prose-img:border prose-img:border-black/10
      prose-table:font-mono prose-table:text-sm
      prose-th:font-bold prose-th:border-b prose-th:border-black/20
      prose-td:border-b prose-td:border-black/10
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
