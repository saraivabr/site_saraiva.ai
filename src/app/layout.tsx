import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://saraiva.ai"),
  alternates: { canonical: "/" },
  title: {
    default: "Saraiva.AI — Operações inteligentes que geram resultado",
    template: "%s — Saraiva.AI",
  },
  description:
    "Diagnóstico, arquitetura e implementação de operações inteligentes para empresas venderem mais, responderem melhor e perderem menos oportunidades.",
  authors: [{ name: "Fellipe Saraiva", url: "https://saraiva.ai/about" }],
  creator: "Fellipe Saraiva",
  icons: { icon: "/brand/favicon.png", apple: "/brand/favicon.png" },
  openGraph: {
    title: "Saraiva.AI — Operações inteligentes que geram resultado",
    description:
      "Transformamos gargalos empresariais em operações que vendem, respondem e funcionam melhor.",
    type: "website",
    locale: "pt_BR",
    siteName: "Saraiva.AI",
    url: "https://saraiva.ai",
    images: [{ url: "/brand/saraiva-ai-logo.png", width: 1200, height: 630, alt: "Saraiva.AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saraiva.AI — Operações inteligentes",
    description: "Diagnóstico e implementação para transformar gargalos em resultado.",
    images: ["/brand/saraiva-ai-logo.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://saraiva.ai/#organization",
      name: "Saraiva.AI",
      url: "https://saraiva.ai",
      logo: "https://saraiva.ai/brand/saraiva-ai-logo.png",
      founder: { "@id": "https://saraiva.ai/#fellipe-saraiva" },
      sameAs: ["https://www.instagram.com/saraiva.ai/", "https://github.com/saraivabr"],
    },
    {
      "@type": "Person",
      "@id": "https://saraiva.ai/#fellipe-saraiva",
      name: "Fellipe Saraiva",
      url: "https://saraiva.ai/about",
      jobTitle: "Estrategista e arquiteto de operações inteligentes",
      worksFor: { "@id": "https://saraiva.ai/#organization" },
    },
    {
      "@type": "WebSite",
      "@id": "https://saraiva.ai/#website",
      url: "https://saraiva.ai",
      name: "Saraiva.AI",
      publisher: { "@id": "https://saraiva.ai/#organization" },
      inLanguage: "pt-BR",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
