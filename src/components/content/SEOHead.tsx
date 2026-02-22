import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
}

const SEOHead = ({ title, description, url, image, type = 'website', publishedTime, tags }: SEOHeadProps) => {
  const fullTitle = `${title} | Saraiva.AI`;
  const siteUrl = 'https://saraiva.ai';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {tags?.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />}
    </Helmet>
  );
};

export default SEOHead;
