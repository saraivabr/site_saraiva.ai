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
  title: { default: "Saraiva.AI — Comece com um desafio", template: "%s — Saraiva.AI" },
  description: "Transforme desafios em soluções reais usando inteligência artificial. Entenda, construa, teste e chegue a um resultado.",
  authors: [{ name: "Saraiva.AI" }],
  icons: { icon: "/brand/favicon.png", apple: "/brand/favicon.png" },
  openGraph: { title: "Saraiva.AI — Comece com um desafio", description: "Comece com um desafio. Termine com algo resolvido.", type: "website", locale: "pt_BR", siteName: "Saraiva.AI", url: "https://saraiva.ai" },
  twitter: { card: "summary", title: "Saraiva.AI", description: "Comece com um desafio. Termine com algo resolvido." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
