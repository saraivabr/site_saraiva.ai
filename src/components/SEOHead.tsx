import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
}

const SEOHead = ({ title, description, path = "/" }: SEOHeadProps) => {
  const siteName = "Saraiva.AI";
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Biblioteca Curada de Inteligência Artificial`;
  const desc = description || "Descubra as melhores ferramentas de IA, prompts prontos, servidores MCP e templates. Curadoria atualizada diariamente.";
  const url = `https://saraiva.ai${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
};

export default SEOHead;
