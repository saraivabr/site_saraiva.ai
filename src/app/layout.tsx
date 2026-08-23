import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// As duas famílias que os tokens da marca esperam (ver src/app/brand/tokens.css).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-stack",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saraiva.ai"),
  title: { default: "Saraiva.AI — Sinal para quem precisa decidir", template: "%s — Saraiva.AI" },
  description: "Notícias, ferramentas e sistemas organizados para transformar inteligência artificial em repertório, trabalho e resultado.",
  authors: [{ name: "Saraiva.AI" }],
  icons: { icon: "/brand/favicon.png", apple: "/brand/favicon.png" },
  openGraph: { title: "Saraiva.AI — Sinal para quem precisa decidir", description: "Inteligência artificial organizada para virar decisão.", type: "website", locale: "pt_BR", siteName: "Saraiva.AI", url: "https://saraiva.ai" },
  twitter: { card: "summary", title: "Saraiva.AI", description: "Inteligência artificial organizada para virar decisão." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
