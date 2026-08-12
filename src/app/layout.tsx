import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://saraiva.ai"),
  title: { default: "Saraiva.AI — Curadoria de Inteligência Artificial", template: "%s — Saraiva.AI" },
  description: "Ferramentas, notícias, vídeos e sistemas de inteligência artificial selecionados para transformar conhecimento em operação.",
  authors: [{ name: "Saraiva.AI" }],
  icons: { icon: "/brand/favicon.png", apple: "/brand/favicon.png" },
  openGraph: { title: "Saraiva.AI — Inteligência aplicada, sem ruído", description: "Curadoria prática de ferramentas, notícias e sistemas de IA.", type: "website", locale: "pt_BR", siteName: "Saraiva.AI", url: "https://saraiva.ai" },
  twitter: { card: "summary_large_image", title: "Saraiva.AI", description: "Inteligência aplicada, sem ruído." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className="h-full antialiased"><body className="min-h-full">{children}</body></html>;
}
